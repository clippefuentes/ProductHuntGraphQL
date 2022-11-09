const mongoose = require('mongoose')
const logger = require('./logger.js')

// Connection URL that includes user name, password, and a database
const mongoDB = 'mongodb://127.0.0.1:27017/products-db'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

// Called when our application connects to the database
db.once('open', () => {
  logger.info('Connected to a DB')
})

mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.info(`${collectionName}.${method}, ${JSON.stringify(query)}, ${doc}`)
})

// Called on MongoDB connection error
db.on('error', () => {
  logger.error('MongoDB error')
}) 