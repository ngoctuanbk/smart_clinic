const {
    isObjectId,
    isMobilePhone,
    isPassport,
    isEmail,
    hasDuplicateInArrays,
    isObject,
} = require('../libs/shared');
const {
    paginate,
    StatusValidator,
    StatusOptionalValidator,
} = require('./GeneralValidator');

const UserName = {
    UserName: {
        notEmpty: true,
        errorMessage: 'UserName is required',
        custom: {
            options: (value) => {
                const regex = /^[a-zA-Z0-9]*$/;
                return regex.test(value);
            },
            errorMessage: 'Not allow special characters and space',
        },
        isLength: {
            errorMessage: 'UserName should be at least 5 chars long',
            options: {
                min: 5,
            },
        },

    },
};

const Password = {
    Password: {
        notEmpty: true,
        errorMessage: 'Password is required',
        isLength: {
            errorMessage: 'Password should be at least 5 chars long',
            options: {
                min: 5,
            },
        },
    },
};


const Info = {
    'Info.FullName': {
        notEmpty: true,
        errorMessage: 'Info.FullName is required',
    },
    'Info.Passport': {
        optional: true,
        custom: {
            options: value => isPassport(value),
            errorMessage: 'Info.Passport invalid',
        },
    },
    'Info.Address': {
        optional: true,
    },
};
const Email = {
    Email: {
        optional: true,
        custom: {
            options: value => isEmail(value),
            errorMessage: 'Email invalid',
        },
    },
};
const Mobile = {
    Mobile: {
        notEmpty: true,
        custom: {
            options: value => isMobilePhone(value),
            errorMessage: 'Mobile invalid',
        },
    },
};

const UserObjectIdValidator = {
    UserObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};

const RoleObjectIdValidator = {
    RoleObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};


// const RoleCodesValidator = {
//     RoleCodes: {
//         notEmpty: true,
//         custom: {
//             options: value => hasDuplicateInArrays(ROLES, value),
//         },
//     },
// };
const createValidator = Object.assign({}, UserName, Password, Info, Email, Mobile, RoleObjectIdValidator);
const updateValidator = Object.assign({}, UserObjectIdValidator, Info, Email, Mobile, RoleObjectIdValidator);
// const updateMobileValidator = Object.assign({}, UserObjectIdValidator, Info);
const listValidator = Object.assign({}, paginate);
// const updateStatusValidator = Object.assign({}, UserObjectIdValidator, StatusValidator);
// const listByRoleValidator = Object.assign({}, RoleObjectIdValidator, StatusOptionalValidator);
module.exports = {
    createValidator,
    listValidator,
    UserObjectIdValidator,
    // updateStatusValidator,
    // listByRoleValidator,
    // updateValidator,
    // // RoleCodesValidator,
    // parentObjectIdValidator,
    // updateMobileValidator,
    // getUsersLdapValidator,
    // UserName,
};
