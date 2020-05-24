const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const PatientSchema = new mongoose.Schema({
    PatientID: {type: String, required: true, unique: true},
    FullName: {type: String, required: true},
    Mobile: {type: String, index: true, required: true},
    Sex: {
        type: String, trim: true, enum: SEX, required: true, index: true,
    },
    Address: {
        Street: {type: String},
        WardObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'wards', index: true},
        DistrictObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'districts', index: true},
        ProvinceObjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'provinces', index: true},
    },
    Age: {type: String, required: true},
    DateOfBirth: {type: String, required: true},
    Career: {type: String},
    Order: {type: Number, default: 255},
    Contact: [
        {
        Name: {type: String},
        Relationship: {type: String},
        Phone: {type: String},
        Home: {type: String},
    },
    ],
    HealthStatus: {
        Height: {type: String},
        Weight: {type: String},
        BMI: {type: String},
        BloodGroup: {type: String},
        BloodPressure: {type: String},
        Allergy: {type: String},
        MedicalHis: {type: String},
        DiseaseHis: {type: String},
    },
    // Diagnose: {type: String},
    Reason: {type: String},
    Status: {type: String, default: STATUS[100]},
    CreatedDate: {type: String, default: generatorTime},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false, toJSON: {virtuals: true}, toObject: {virtuals: true}});

autoIncrement.initialize(mongoose.connection);
PatientSchema.plugin(mongoosePaginate);
PatientSchema.plugin(uniqueValidator);
PatientSchema.plugin(autoIncrement.plugin, {
    model: 'patients',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});

const PatientModel = mongoose.model('patients', PatientSchema);
module.exports = PatientModel;
