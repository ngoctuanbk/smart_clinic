const {
    hasProperty,
} = require('../libs/shared');

const { STATUS } = require('../constants/constants');

const STATUS_NUMBERS = [100, 200, 400];

function statusValidate(required = true) {
    return {
        Status: {
            [required ? 'notEmpty' : 'optional']: true,
            custom: {
                options: value => hasProperty(STATUS, value),
                errorMessage: `Status must be number in [${STATUS_NUMBERS}]`,
            },
            errorMessage: 'Status is required',
        },
    };
}

module.exports.paginate = {
    Page: {
        notEmpty: true,
        optional: true,
        isNumeric: true,
        errorMessage: 'Page is number',
    },
    Limit: {
        notEmpty: true,
        optional: true,
        isNumeric: true,
        errorMessage: 'Limit is number',
    },
    SortKey: {
        notEmpty: true,
        optional: true,
        errorMessage: 'SortKey is required',
    },
    SortOrder: {
        notEmpty: true,
        optional: true,
        isNumeric: true,
        errorMessage: 'SortOrder is number',
    },
};

module.exports.StatusValidator = statusValidate(true);

module.exports.StatusOptionalValidator = statusValidate(false);
