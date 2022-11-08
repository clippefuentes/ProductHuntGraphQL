const { productsData, usersData, categoriesData } = require('./dummydata')

const resolvers = {
  Query: {
    appName: () => 'ProductHunt clone',
    allProducts: () => {
      return productsData
    },
    productsByAuthor: (_, { authorName }) => {
      const user = usersData.find(user => user.userName === authorName)
      console.log('user', user)
      return productsData.filter(product => product.authorId === user.id)
    },
    productsByCategory: (_, { slug }) => {
      const category = categoriesData.find(category => category.slug === slug);
      console.log('category', category)
      const products = productsData.filter(product => {
        return product.categoriesIds.includes(category.id)
      })
      return products;
    },
  },
  Product: {
    author: (product) => {
      console.log(`Query.Product.author for "${product.name}"`)
      return usersData.find(user => user.id === product.authorId)
    },
    categories: (product) => {
      const res = product.categoriesIds.map(id => {
       return categoriesData.find(category => {
          return id === category.id
        })
      })

      return res
    }
  },
}

module.exports = {
  resolvers
}