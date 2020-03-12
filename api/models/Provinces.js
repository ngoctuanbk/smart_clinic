const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const ProvinceSchema = new mongoose.Schema({
    ProvinceName: {type: String, unique: true, required: true},
    ProvinceCode: {type: String, unique: true, required: true},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200], index: true},
    CreatedDate: {type: String, default: generatorTime()},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
ProvinceSchema.plugin(mongoosePaginate);
ProvinceSchema.plugin(uniqueValidator);
ProvinceSchema.plugin(autoIncrement.plugin, {
    model: 'provinces',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});

const ProvinceModel = mongoose.model('provinces', ProvinceSchema);
module.exports = ProvinceModel;
