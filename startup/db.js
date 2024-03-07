const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {

// Construct MongoDB URI from environment variables via config
const dbHost = config.get('db.host');
const dbPort = config.get('db.port');
const dbName = config.get('db.name');
const mongodbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

// MongoDB connection
mongoose.connect(mongodbURI).then(() => winston.info('MongoDB Connected'));

}