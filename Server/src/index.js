const { ApolloServer } = require('apollo-server')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const { readSchema } = require('./schema.js')
const { resolvers } = require('./resolvers.js')

require('./mongo.js')

const typeDefs = readSchema()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
  // debug: false,
})

server.listen().then(() => {
  console.log('Listening on port 4000')
})