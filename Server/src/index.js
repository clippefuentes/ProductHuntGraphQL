const { ApolloServer } = require('apollo-server-express')
const express = require('express');
const cors = require('cors')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const { readSchema } = require('./schema.js')
const { resolvers } = require('./resolvers.js')

require('./mongo.js')

const typeDefs = readSchema()
let server = null;

const app = express();
app.use(cors({
  origin: '*'
}));

async function startServer() {
  server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    // cors: {
    //   origin: '*' // I have tried `allowedOrigins` here but no sucess
    // },
    // debug: false,
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