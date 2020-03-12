const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const DistrictSchema = new mongoose.Schema({
    DistrictName: {type: String, required: true},
    DistrictCode: {type: String, unique: true, required: true},
    ProvinceObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'provinces', index: true,
    },
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200], index: true},
    CreatedDate: {type: String, default: generatorTime()},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
DistrictSchema.plugin(mongoosePaginate);
DistrictSchema.plugin(uniqueValidator);
DistrictSchema.plugin(autoIncrement.plugin, {
    model: 'districts',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});

const DistrictModel = mongoose.model('districts', DistrictSchema);
module.exports = DistrictModel;
