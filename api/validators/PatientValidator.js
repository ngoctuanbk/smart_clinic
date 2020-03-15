const { isMobilePhone, isObjectId, isObject } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');
const { SEX } = require('../constants/constants');


const FullName = {
    FullName: {
        notEmpty: true,
    },
};

const Mobile = {
    Mobile: {
        notEmpty: true,
        custom: {
            options: value => isMobilePhone(value),
        },
    },
};

const Sex = {
    Sex: {
        notEmpty: true,
        custom: {
            options: value => SEX.includes(value),
        },
    },
};
const addressValidator = {
    Address: {
        notEmpty: true,
        custom: {
            options: value => isObject(value),
        },
    },
    'Address.Street': {
        notEmpty: true,
        errorMessage: 'Street is required',
    },
    'Address.DistrictObjectId': {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
            errorMessage: 'Address.DistrictObjectId must be an ObjectId',
        },
        errorMessage: 'Address.DistrictObjectId is required',
    },
    'Address.ProvinceObjectId': {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
            errorMessage: 'ProvinceObjectId must be an ObjectId',
        },
        errorMessage: 'Address.ProvinceObjectId is required',
    },
    'Address.WardObjectId': {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
            errorMessage: 'Address.WardObjectId must be an ObjectId',
        },
    },
};
const PatientObjectIdValidator = {
    PatientObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};

const createValidator = Object.assign({}, FullName, Mobile, addressValidator, Sex);
const listValidator = Object.assign({}, paginate);
const updateStatusValidator = Object.assign({}, PatientObjectIdValidator, StatusValidator);

module.exports = {
    createValidator,
    listValidator,
    updateStatusValidator,
};
