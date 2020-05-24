const { notSpaceAllow, isObjectId } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');


const LabName = {
    LabName: {
        notEmpty: true,
    },
};
const Result = {
    Result: {
        notEmpty: true,
    },
};

const LabObjectIdValidator = {
    LabObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
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

const listValidator = Object.assign({}, paginate);
const createValidator = Object.assign({}, LabName, PatientObjectIdValidator);
const updateValidator = Object.assign({}, LabObjectIdValidator);
const updateStatusValidator = Object.assign({}, LabObjectIdValidator, StatusValidator);

module.exports = {
    listValidator,
    createValidator,
    updateValidator,
    updateStatusValidator,
    LabObjectIdValidator,
    PatientObjectIdValidator
};
