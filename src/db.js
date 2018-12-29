import logger from './logger';
// Mongo DB start here

logger.info('Connecting database...');
const mongoose = require('mongoose');
// load VCAP configuration  and service credentials
const vcapCredentials = require('./config/vcap-local.json');

const options = {
  // useNewUrlParser: true,
  // autoIndex: false, // Don't build indexes
  // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  // reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // family: 4 // Use IPv4, skip trying IPv6
};

// mongoose.connect(vcapCredentials.uri, options);
mongoose.connect(
  vcapCredentials.uri,
  options,
);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('connection', () => logger.info('Connected to the database.'));

db.on('error', err => {
  logger.error(`MongoDB connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
});

export default db;
