const winstons = require('winston');
const config = require('./config');


const enumerateErrorFormat = winstons.format((info) => {
    if (info instanceof Error){
        Object.assign(info, {message: info.stack});
    }
    return info;
})

const logger = winstons.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winstons.format.combine(
        enumerateErrorFormat(),
        config.env === 'development'
        ? winstons.format.colorize() : winstons.format.uncolorize(),
        winstons.format.splat(),
        winstons.format.printf(({ level, message }) => `{level}: ${message}`)
    ),
    transports:[
        new winstons.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

module.exports = logger;