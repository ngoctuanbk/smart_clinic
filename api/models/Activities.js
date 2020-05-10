const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const ActivitiesSchema = new mongoose.Schema({
    ActivityName: {type: String, required: true},
    PatientObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'patients', index: true,
    },
    UserObjectId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true,
    },
    Description: {type: String},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200], index: true},
    CreatedDate: {type: String, default: generatorTime()},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
ActivitiesSchema.plugin(mongoosePaginate);
ActivitiesSchema.plugin(uniqueValidator);
ActivitiesSchema.plugin(autoIncrement.plugin, {
    model: 'activities',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});
const ActivityModel = mongoose.model('activities', ActivitiesSchema);
module.exports = ActivityModel;
