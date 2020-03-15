const { isObjectId } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');


const PatientObjectIdValidator = {
    PatientObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
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

const createValidator = Object.assign({}, PatientObjectIdValidator, UserObjectIdValidator);
const listValidator = Object.assign({});

module.exports = {
    createValidator,
    listValidator,
};
