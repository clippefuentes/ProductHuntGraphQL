const mongoose = require('mongoose')
const { UserInputError } = require('apollo-server');

const Product = require('./models/Product.js')
const Category = require('./models/Category.js')
const User = require('./models/User.js')

const resolvers = {
  Query: {
    appName: () => 'ProductHunt clone',
    allProducts: () => {
      return Product.find({})
    },
    productsByCategory: async (_, { slug }) => {
      const category = await Category.findOne({ slug })
      return Product.find({ categoriesIds: category._id })
    },
    productsByAuthor: async (_, { authorName }) => {
      const user = await User.findOne({
        userName: authorName
      })

      if (!user) {
        // User does not exist, throwing an error
        throw new UserInputError('User does not exist')
      }

      return Product.find({ authorId: user._id })
    },
    allCategories: () => {
      return Category.find()
    },
  },
  Product: {
    author: (product) => {
      return User.findById(product.authorId)
    },
    categories: (product) => {
      const allIds = product.categoriesIds
      return Category.find().where('_id').in(allIds)
    },
    publishedAt: (product) => {
      return product.publishedAt.toISOString()
    },
  },
  Mutation: {
    createProduct: async (_, { input }) => {
      const author = await User.findOne({ userName: "ellen" })
      return Product.create({
        name: input.name,
        description: input.description,
        url: input.url,
        numberOfVotes: 0,
        publishedAt: Date.now(),
        authorId: author._id,
        categoriesIds: input.categoriesIds,
      });
    },

    createCategory: async(_, { input } ) => {
      errors = []
      if (!input.user) {
        errors.push({
          field: 'user',
          error: 'Should not be empty'
        })
      }
      if (!input.slug) {
        errors.push({
          field: 'slug',
          error: 'Should not be empty'
        })
      }
      if (errors) {
        // Create an error with additional information
        throw new UserInputError('Invalid input', {
          validationErrors: errors
        });
      }
      return Category.create({
        slug: input.slug,
        name: input.name,
       });
    }
  }
}

module.exports = {
  resolvers
}