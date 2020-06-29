const { notSpaceAllow, isObjectId } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');


const MedicineName = {
    MedicineName: {
        notEmpty: true,
    },
};

const MedicineCode = {
    MedicineCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'MedicineCode not space',
        },
    },
};

const BrandObjectIdValidator = {
    BrandObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};
const _idValidator = {
    MedicineObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};

const listValidator = Object.assign({}, paginate);
const createValidator = Object.assign({}, MedicineName, MedicineCode, BrandObjectIdValidator);
const updateValidator = Object.assign({}, MedicineName, MedicineCode, BrandObjectIdValidator, _idValidator);
const updateStatusValidator = Object.assign({}, _idValidator, StatusValidator);

module.exports = {
    listValidator,
    createValidator,
    updateValidator,
    updateStatusValidator
};
