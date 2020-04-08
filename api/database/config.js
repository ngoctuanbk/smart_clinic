const mongoose = require('mongoose');
// const db_config = require('../settings/config').settings.DB;
// const { NODE_ENV = 'development' } = process.env;
// const MONGODB_PORT = 49347;
// const MONGODB_HOST = 'ds049347.mlab.com';
// const MONGODB_DATABASE_NAME = '/smart_clinic';
// const MONGODB_USER = 'tuantn';
// const MONGODB_USER_PWD = encodeURIComponent('tuan98@bkhn');
// const MONGODB_URI = `mongodb://${MONGODB_USER}:${MONGODB_USER_PWD}@${MONGODB_HOST}:${MONGODB_PORT}${MONGODB_DATABASE_NAME}`;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/admin';
function handleConnect(err) {
    if (err) {
        console.log('Connecting to Database failed!');
    } else {
        console.log('Connecting to Database success!');
    }
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false }, handleConnect);