const util = require('util');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const RoleSchema = new mongoose.Schema({
    RoleCode: {type: String, required: true, unique: true},
    RoleName: {type: String, required: true, unique: true},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200], index: true},
    CreatedDate: {type: String, default: generatorTime()},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
RoleSchema.plugin(mongoosePaginate);
RoleSchema.plugin(uniqueValidator);
RoleSchema.plugin(autoIncrement.plugin, {
    model: 'roles',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});
const RoleModel = mongoose.model('roles', RoleSchema);
module.exports = RoleModel;
