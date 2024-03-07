const config = require('config');
const winston = require('winston');

module.exports = function() {

  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }

  // Logging configuration parameters
  winston.info('Application name: ' + config.get('name'));
  winston.info('Mail server: ' + config.get('mail.host'));
  winston.info('Database host: ' + config.get('db.host'));
}