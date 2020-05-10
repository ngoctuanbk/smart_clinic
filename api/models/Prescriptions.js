const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const PrescriptionSchema = new mongoose.Schema({
    PrescriptionCode: {type: String, required: true, unique: true},
    PatientObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'patients', index: true,
    },

    OrderDetail: [
        {
            MedicineObjectId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'medicines', index: true},
            Quantity: {type: Number},
            Unit: {type: String, required:true, default: 0},
            Price: {type: Number, required:true, default: 0},
            TotalPrice: {type: Number, required:true, default: 0},
        },
    ],
    SumTotalPrice: {type: Number, required:true, default: 0},
    Status: {type: String, default: STATUS[100]},
    CreatedDate: {type: String, default: generatorTime},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false, toJSON: {virtuals: true}, toObject: {virtuals: true}});

autoIncrement.initialize(mongoose.connection);
PrescriptionSchema.plugin(mongoosePaginate);
PrescriptionSchema.plugin(uniqueValidator);
PrescriptionSchema.plugin(autoIncrement.plugin, {
    model: 'prescriptions',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});

const PrescriptionModel = mongoose.model('prescriptions', PrescriptionSchema);
module.exports = PrescriptionModel;
