const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const WardSchema = new mongoose.Schema({
    WardName: {type: String, required: true},
    WardCode: {type: String, unique: true, required: true},
    DistrictObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'districts', index: true,
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
WardSchema.plugin(mongoosePaginate);
WardSchema.plugin(uniqueValidator);
WardSchema.plugin(autoIncrement.plugin, {
    model: 'wards',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});
const WardModel = mongoose.model('wards', WardSchema);
module.exports = WardModel;
