const { notSpaceAllow, isObjectId } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');


const BrandName = {
    BrandName: {
        notEmpty: true,
    },
};

const BrandCode = {
    BrandCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'BrandCode not space',
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

const listValidator = Object.assign({}, paginate);
const createValidator = Object.assign({}, BrandName, BrandCode);
const updateValidator = Object.assign({}, BrandObjectIdValidator, BrandName, BrandCode);
const updateStatusValidator = Object.assign({}, BrandObjectIdValidator, StatusValidator);

module.exports = {
    listValidator,
    createValidator,
    updateValidator,
    updateStatusValidator,
    BrandObjectIdValidator,
};
