const { UserInputError, AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('./auth.js')

const Product = require('./models/Product.js')
const Category = require('./models/Category.js')
const User = require('./models/User.js')

const resolvers = {
  Query: {
    appName: () => 'ProductHunt clone',
    allProducts: async () => {
      const products = await Product.find({})
      return products
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
    id: (product) => {
      return product._id
    },
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
    createProduct: async (_, { input }, { userId }) => {
      if (!userId) {
        throw new AuthenticationError('Authentication required')
      }
      return Product.create({
        name: input.name,
        description: input.description,
        url: input.url,
        numberOfVotes: 0,
        publishedAt: Date.now(),
        authorId: userId,
        categoriesIds: input.categoriesIds,
      });
    },
    createCategory: async (_, { input }) => {
      if (!userId) {
        throw new AuthenticationError('Authentication required')
      }
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
    },
    upvoteProduct: async (_, { productId }, { userId }) => {
      if (!userId) {
        throw new AuthenticationError('Authentication required')
      }

      return Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { 'numberOfVotes': 1 } },
        { new: true }
      )
    },
    login: async (_, { userName, password }, context) => {
      console.log('userName, password ', userName, password )
      const user = await User.findOne({
        userName
      })

      if (!user) {
        throw new AuthenticationError('Invalid credentials')
      }

      if (!bcrypt.compare(password, user.passwordHash)) {
        throw new AuthenticationError('Invalid credentials')
      }

      const jwtStr = jwt.sign(
        {
          userId: user.id
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      const expiresIn = 60 * 60 * 1000;
      console.log('expiresIn', expiresIn)
      context.res.cookie('authCookie', jwtStr, {
        maxAge: expiresIn,
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })

      return {
        expiresIn,
        user,
      }
    },
    logOut: async (_, __, { res }) => {
      res.clearCookie('authCookie', {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true
      })
      return true
    }
  }
}

module.exports = {
  resolvers
}