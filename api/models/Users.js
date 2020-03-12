const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const {STATUS, DELETE_FLAG, SEX} = require('../constants/constants');
const {generatorTime} = require('../libs/shared');

const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        trim: true,
        sparse: true,
        unique: 'Two users cannot share the same username ({VALUE})',
    },
    Password: {type: String, required: true, trim: true},
    Mobile: {
        type: String, required: true, trim: true, sparse: true,
    },
    Email: {
        type: String, trim: true, sparse: true,
    },
    Info: {
        FullName: {type: String},
        Passport: {type: String},
        Address: {type: String},
    },
    Sex: {
        type: String, trim: true, enum: SEX, required: true, index: true,
    },
    RoleObjectId: {required: true, type: mongoose.Schema.Types.ObjectId, ref: 'roles'},
    Avatar: {type: String},
    JoinDate: {type: String},
    DateOfBirth: {type: String},
    Order: {type: Number, default: 255},
    Status: {type: String, default: STATUS[200], index: true},
    CreatedDate: {type: String, default: generatorTime(), required: true},
    CreatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    UpdatedDate: {type: String},
    UpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    ExpiresDate: {type: String, default: generatorTime(), required: true},
    DeleteFlag: {type: String, default: DELETE_FLAG[200], index: true},
}, {versionKey: false});


autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(uniqueValidator);
UserSchema.plugin(autoIncrement.plugin, {
    model: 'users',
    field: 'AutoIncrement',
    unique: true,
    required: true,
    index: 100,
});
// generating a hash
UserSchema.methods.generateHashPassword = Password => bcrypt.hashSync(String(Password), bcrypt.genSaltSync(8), null);

// checking if password is valid
// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function (Password) {
    return bcrypt.compareSync(Password, this.Password);
};
UserSchema.index({
    UserName: 1, DeleteFlag: 1,
}, { unique: true});
UserSchema.index({
    Mobile: 1, DeleteFlag: 1,
}, { unique: true});
UserSchema.index({
    Email: 1, DeleteFlag: 1,
}, {
    unique: true,
    partialFilterExpression: {
        Email: {
            $type: 'string',
        },
    },
});
const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
