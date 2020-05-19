const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const {DELETE_FLAG, STATUS} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const PhotoSchema = new mongoose.Schema({
    ImagesDir: {type: String, required: true},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200]},
    CreatedDate: {type: String, default: generatorTime},
    UpdatedDate: {type: String},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});

autoIncrement.initialize(mongoose.connection);
PhotoSchema.plugin(mongoosePaginate);
PhotoSchema.plugin(uniqueValidator);
PhotoSchema.plugin(autoIncrement.plugin, {
    model: 'photos',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 1,
});
const PhotoModel = mongoose.model('photos', PhotoSchema);
module.exports = PhotoModel;
