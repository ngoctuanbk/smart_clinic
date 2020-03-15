const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const ScheduleSchema = new mongoose.Schema({
    UserObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users', index: true,
    },
    PatientObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'patients', index: true,
    },
    TimeWorkStart: {
        type: String, trim: true, index: true, sparse: true,
    },
    TimeWorkEnd: {
        type: String, trim: true, index: true, sparse: true,
    },
    Date: {
        type: String, required: true, trim: true, index: true,
    },
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[100], index: true},
    CreatedDate: {type: String, default: generatorTime()},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
ScheduleSchema.plugin(mongoosePaginate);
ScheduleSchema.plugin(uniqueValidator);
ScheduleSchema.plugin(autoIncrement.plugin, {
    model: 'schedules',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});
const ScheduleModel = mongoose.model('schedules', ScheduleSchema);
module.exports = ScheduleModel;
