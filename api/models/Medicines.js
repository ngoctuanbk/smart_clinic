const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const MedicineSchema = new mongoose.Schema({
    MedicineCode: {type: String, required: true, unique: true},
    MedicineName: {type: String, required: true, unique: true},
    BrandObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'brands', index: true,
    },
    Price: {type: Number, required: true},
    Quantity: {type: Number, required: true},
    LotNumber: {type: String, required: true},
    Unit: {type: String, required: true},
    MFG: {type: String},
    EXP: {type: String},
    Status: {type: String, default: STATUS[200]},
    CreatedDate: {type: String, default: generatorTime},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false, toJSON: {virtuals: true}, toObject: {virtuals: true}});

autoIncrement.initialize(mongoose.connection);
MedicineSchema.plugin(mongoosePaginate);
MedicineSchema.plugin(uniqueValidator);
MedicineSchema.plugin(autoIncrement.plugin, {
    model: 'medicines',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});

const MedicineModel = mongoose.model('medicines', MedicineSchema);
module.exports = MedicineModel;
