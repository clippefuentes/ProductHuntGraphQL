const { ApolloServer } = require('apollo-server-express')
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const { readSchema } = require('./schema.js')
const { resolvers } = require('./resolvers.js')
const logger = require('./logger')
const { JWT_SECRET } = require('./auth')
require('./mongo.js')

const typeDefs = readSchema()
let server = null;

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(cookieParser())

async function startServer() {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => {
      const jwtToken = req.cookies.authCookie
      let userId = null
      try {
        const decodedJwt = jwt.verify(jwtToken, JWT_SECRET)
        userId = decodedJwt.userId
      } catch (err) {
        logger.warn('Invalid JWT')
      }
      return {
        userId,
        req,
        res
      }
    }
  });
  await server.start();
  server.applyMiddleware({ app });
}

startServer()
// server.start()
// server.applyMiddleware(app)

// app.listen().then(() => {
//   console.log('Listening on port 4000')
// })

app.listen(4000, () => {
  console.log('Listening on port 4000')
})