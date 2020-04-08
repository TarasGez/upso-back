const clc = require('cli-color')

const mongoose = require('mongoose')

const config = require('./config')

module.exports = () => {
    mongoose
        .connect(config.mongoUri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => console.log(clc.yellowBright('MongoDB has been connected')))
        .catch((e) => console.log('MongoDB ERROR:', e))
}