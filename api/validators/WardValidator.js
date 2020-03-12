const {
    isObjectId,
    notSpaceAllow,
} = require('../libs/shared');

const WardName = {
    WardName: {
        notEmpty: true,
        errorMessage: 'WardName is required',
    },
};

const WardCode = {
    WardCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'WardCode not space',
        },
        errorMessage: 'WardCode is required',
    },
};
const DistrictObjectId = {
    DistrictObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
            errorMessage: 'DistrictObjectId must be ObjectId',
        },
    },
};

const DistrictObjectIdValidator = {
    DistrictObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};
const createValidator = Object.assign({}, WardName, WardCode, DistrictObjectId);

module.exports = {
    createValidator,
    DistrictObjectIdValidator,
};
