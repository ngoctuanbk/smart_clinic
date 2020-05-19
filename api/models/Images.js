const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS, STATE} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const ImageSchema = new mongoose.Schema({
    ImageCode: {type: String, required: true, unique: true},
    PatientObjectId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'patients', index: true,
    },
    UserObjectId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true,
    },
    Images: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'photos', index: true, sparse: true,
    }],
    Type: {type: String, required: true},
    Note: {type: String},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[100]},
    CreatedDate: {type: String, default: generatorTime()},
    UpdatedDate: {type: String},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
ImageSchema.plugin(mongoosePaginate);
ImageSchema.plugin(uniqueValidator);
ImageSchema.plugin(autoIncrement.plugin, {
    model: 'images',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});

const ImageModel = mongoose.model('images', ImageSchema);
module.exports = ImageModel;
