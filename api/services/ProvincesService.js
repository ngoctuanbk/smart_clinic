/* eslint-disable prefer-destructuring */
const ProvinceModel = require('../models/Provinces');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {
    generatorTime,
    compareValue,
    connectDatabase,
    promiseReject,
    promiseResolve,
    convertToArrayObjectId,
} = require('../libs/shared');

module.exports = {
    create: async (data) => {
        try {
            const set = {};
            set.ProvinceName = data.ProvinceName;
            set.ProvinceCode = data.ProvinceCode;
            set.CreatedBy = data.CreatedBy;
            set.CreatedDate = generatorTime();
            const result = await ProvinceModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkProvinceCodeExist: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                ProvinceCode: data.ProvinceCode,
            };
            const result = await ProvinceModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.ProvinceObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkProvinceNameExist: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                ProvinceName: data.ProvinceName,
            };
            const result = await ProvinceModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.ProvinceObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listActive: async (data) => {
        try {
            const conditions = {
                Status: STATUS[200],
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelected = '_id ProvinceName ProvinceCode';
            const result = await ProvinceModel.find(conditions).select(fieldsSelected);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
