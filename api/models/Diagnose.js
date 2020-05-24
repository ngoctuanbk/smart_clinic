const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const DiagnoseSchema = new mongoose.Schema({
    Type: {type: String, required: true},
    PatientObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'patients', index: true,
    },
    UserObjectId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true,
    },
    Description: {type: String},
    CreatedDate: {type: String, default: generatorTime},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
DiagnoseSchema.plugin(mongoosePaginate);
DiagnoseSchema.plugin(uniqueValidator);
DiagnoseSchema.plugin(autoIncrement.plugin, {
    model: 'diagnose',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});

const DiagnoseModel = mongoose.model('diagnose', DiagnoseSchema);
module.exports = DiagnoseModel;
