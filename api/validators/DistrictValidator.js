const {
    isObjectId,
    notSpaceAllow,
} = require('../libs/shared');

const DistrictNameValidator = {
    DistrictName: {
        notEmpty: true,
    },
};

const DistrictCodeValidator = {
    DistrictCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'DistrictCode not space',
        },
    },
};

const ProvinceObjectIdValidator = {
    ProvinceObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};

// eslint-disable-next-line max-len
const createValidator = Object.assign({}, DistrictNameValidator, DistrictCodeValidator, ProvinceObjectIdValidator);
module.exports = {
    createValidator,
    ProvinceObjectIdValidator,
};
