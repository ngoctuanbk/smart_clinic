const {NODE_ENV = 'development'} = process.env;
const settings = require(`./setting_${NODE_ENV}`);
exports.settings = settings;
