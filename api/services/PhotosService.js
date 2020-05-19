const PhotoModel = require('../models/Photos');

const {
    generatorTime,
    promiseReject,
    promiseResolve,
} = require('../libs/shared');

module.exports = {
    createMany: async function (data) { // eslint-disable-line
        try {
            const result = await PhotoModel.create(data.records);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
