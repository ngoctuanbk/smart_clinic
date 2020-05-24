const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const LabSchema = new mongoose.Schema({
    LabCode: {type: String, required: true, unique: true},
    LabName: {type: String, required: true},
    PatientObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'patients', index: true,
    },
    UserObjectId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true,
    },
    // LabDetail: [
    //     {
    //         LabType: {type: String, required: true},
    //         Result: {type: String},
    //     },
    // ],
    Note: {type: String},
    Status: {type: String, default: STATUS[100]},
    CreatedDate: {type: String, default: generatorTime},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false, toJSON: {virtuals: true}, toObject: {virtuals: true}});

autoIncrement.initialize(mongoose.connection);
LabSchema.plugin(mongoosePaginate);
LabSchema.plugin(uniqueValidator);
LabSchema.plugin(autoIncrement.plugin, {
    model: 'labs',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});
LabSchema.virtual('LabDetails', {
    ref: 'lab_details',
    localField: '_id',
    foreignField: 'LabObjectId',
});

const LabModel = mongoose.model('labs', LabSchema);
module.exports = LabModel;
