const mongoose = require('mongoose');
// const db_config = require('../settings/config').settings.DB;
// const { NODE_ENV = 'development' } = process.env;
const MONGODB_PORT = 49347;
const MONGODB_HOST = 'ds049347.mlab.com';
const MONGODB_DATABASE_NAME = '/smart_clinic';
const MONGODB_USER = 'tuantn';
const MONGODB_USER_PWD = encodeURIComponent('tuan98@bkhn');
const MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_USER_PWD}@${MONGODB_HOST}:${MONGODB_PORT}${MONGODB_DATABASE_NAME}`;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Promise = require('bluebird');

mongoose.Promise = Promise;
(async () => {
    async function connectDb() {
        try {
            await mongoose.connect(MONGODB_URI, {autoIndex: true, useNewUrlParser: true});
            console.log('connected to system database!');
        } catch (err) {
            return Promise.reject(err);
        }
    }
    const connected = await connectDb();
    console.log(connected);
    module.exports.database = connected.database;
})();
