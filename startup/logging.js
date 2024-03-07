const winston = require('winston');
require('express-async-errors');

module.exports = function () {

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ level: "error", filename: 'logfile.log' })
        ]
    });

    logger.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // Log to console in development only
    if (process.env.NODE_ENV === 'development') {

        logger.add(new winston.transports.Console({
            colorize: true,
            prettyPrint: true,
            format: winston.format.simple()
        }));

    }

    winston.add(logger);

};
