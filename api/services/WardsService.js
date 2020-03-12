const {STATUS, DELETE_FLAG} = require('../constants/constants');
const WardModel = require('../models/Wards');
const {
    connectDatabase,
    generatorTime,
    compareValue,
    promiseReject,
    promiseResolve,
    trimValue,
    RegExpSearch,
    convertToArrayObjectId,
    convertToObjectId,
} = require('../libs/shared');

module.exports = {
    create: async function (data) { // eslint-disable-line
        try {
            const set = {
                WardName: data.WardName,
                WardCode: data.WardCode,
                DistrictObjectId: data.DistrictObjectId,
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await WardModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkWardCodeExist: async (data) => {
        try {
            const conditions = {
                WardCode: data.WardCode,
            };
            const result = await WardModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.WardObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    }, 
    listActiveByDistrict: async (data) => {
        try {
            const conditions = {
                Status: STATUS[200],
                DeleteFlag: DELETE_FLAG[200],
                DistrictObjectId: convertToObjectId(data.DistrictObjectId),
            };
            const fieldsSelected = 'WardCode WardName DistrictObjectId';
            const result = await WardModel.find(conditions).select(fieldsSelected);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
