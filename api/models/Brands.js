const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, BRAND_TYPE} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const BrandsSchema = new mongoose.Schema({
    BrandName: {type: String, required: true},
    BrandCode: {type: String, unique: true, required: true},
    Description: {type: String},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200], index: true},
    CreatedDate: {type: String, default: generatorTime()},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
BrandsSchema.plugin(mongoosePaginate);
BrandsSchema.plugin(uniqueValidator);
BrandsSchema.plugin(autoIncrement.plugin, {
    model: 'brands',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});
BrandsSchema.index({
    BrandCode: 1, DeleteFlag: 1,
}, { unique: true});
const BrandModel = mongoose.model('brands', BrandsSchema);
module.exports = BrandModel;
