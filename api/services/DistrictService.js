const DistrictModel = require('../models/Districts');
const {
    generatorTime,
    compareValue,
    connectDatabase,
    promiseReject,
    promiseResolve,
    RegExpSearch,
    convertToObjectId,
} = require('../libs/shared');

const {
    STATUS, DELETE_FLAG,
} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {};
            set.DistrictName = data.DistrictName;
            set.DistrictCode = data.DistrictCode;
            set.ProvinceObjectId = data.ProvinceObjectId;
            set.CreatedBy = data.CreatedBy;
            set.CreatedDate = generatorTime();
            const result = await DistrictModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkDistrictCodeExist: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                DistrictCode: data.DistrictCode,
            };
            const result = await DistrictModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.DistrictObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkDistrictNameExist: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                DistrictName: data.DistrictName,
            };
            const result = await DistrictModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.DistrictObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listActiveByProvince: async (data) => {
        try {
            const conditions = {
                Status: STATUS[200],
                DeleteFlag: DELETE_FLAG[200],
                ProvinceObjectId: convertToObjectId(data.ProvinceObjectId),
            };
            const fieldsSelected = 'DistrictName DistrictCode ProvinceObjectId';
            const result = await DistrictModel.find(conditions).select(fieldsSelected);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
