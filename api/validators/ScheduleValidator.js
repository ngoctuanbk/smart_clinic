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
const ScheduleObjectIdValidator = {
    ScheduleObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
            errorMessage: 'ScheduleObjectId must is ObjectId',
        },
        errorMessage: 'ScheduleObjectId is required',
    },
};

const createValidator = Object.assign({}, PatientObjectIdValidator, UserObjectIdValidator);
const listValidator = Object.assign({});
const infoValidator = Object.assign({}, ScheduleObjectIdValidator);
const updateStatusValidator = Object.assign({}, ScheduleObjectIdValidator, StatusValidator);

module.exports = {
    createValidator,
    listValidator,
    infoValidator,
    updateStatusValidator,
};
