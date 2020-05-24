const { notSpaceAllow, isObjectId } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');


const ImageCode = {
    ImageCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'ImageCode not space',
        },
    },
};
const Type = {
    Type: {
        notEmpty: true,
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
const _idValidator = {
    ImageObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
}; 

const listValidator = Object.assign({}, paginate);
const createValidator = Object.assign({}, ImageCode, Type, PatientObjectIdValidator);
const updateValidator = Object.assign({}, _idValidator);
const updateStatusValidator = Object.assign({}, _idValidator, StatusValidator);

module.exports = {
    listValidator,
    createValidator,
    PatientObjectIdValidator,
    // updateValidator,
    updateStatusValidator,
};
