const {
    notSpaceAllow,
} = require('../libs/shared');

const { paginate} = require('./GeneralValidator');

const ProvinceName = {
    ProvinceName: {
        notEmpty: true,
    },
};

const ProvinceCode = {
    ProvinceCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'ProvinceCode not space',
        },
    },
};

const listValidator = Object.assign({}, paginate);
const createValidator = Object.assign({}, ProvinceName, ProvinceCode);
module.exports = {
    createValidator,
    listValidator,
};
