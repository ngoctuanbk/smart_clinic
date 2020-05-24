const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const LabDetailSchema = new mongoose.Schema({
    LabObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'labs', index: true,
    }, 
    LabType: {type: String, required: true,},
    Result: [{key: String, value: String}],
    CreatedDate: {type: String, default: generatorTime},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
LabDetailSchema.plugin(mongoosePaginate);
LabDetailSchema.plugin(uniqueValidator);
LabDetailSchema.plugin(autoIncrement.plugin, {
    model: 'lab_details',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});

const LabDetailModel = mongoose.model('lab_details', LabDetailSchema);
module.exports = LabDetailModel;
