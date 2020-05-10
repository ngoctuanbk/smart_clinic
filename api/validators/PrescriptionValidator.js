const { notSpaceAllow, isObjectId } = require('../libs/shared');

const { paginate, StatusValidator } = require('./GeneralValidator');


const PatientObjectIdValidator = {
    PatientObjectId: {
        notEmpty: true,
        custom: {
            options: value => isObjectId(value),
        },
    },
};

const listValidator = Object.assign({}, paginate);
const createValidator = Object.assign({}, PatientObjectIdValidator);
// const updateValidator = Object.assign({}, LabObjectIdValidator);
// const updateStatusValidator = Object.assign({}, BrandObjectIdValidator, StatusValidator);

module.exports = {
    listValidator,
    createValidator,
    // updateValidator,
    // updateStatusValidator,
    // LabObjectIdValidator,
};
