const {
    notSpaceAllow
} = require('../libs/shared');


const RoleName = {
    RoleName: {
        notEmpty: true,
    },
};

const RoleCode = {
    RoleCode: {
        notEmpty: true,
        custom: {
            options: value => notSpaceAllow(value),
            errorMessage: 'RoleCode not space',
        },
    },
};
const createValidator = Object.assign({}, RoleName, RoleCode);
module.exports = {
    createValidator,
};
