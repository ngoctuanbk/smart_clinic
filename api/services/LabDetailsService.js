const LabDetailModel = require('../models/LabDetail');
const {
    promiseReject,
    promiseResolve,
    generatorTime,
} = require('../libs/shared');
const { STATUS, DELETE_FLAG} = require('../constants/constants');

module.exports = {
    createMany: async (data) => {
        try {
            const result = await LabDetailModel.create(data.records);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateImportFile: async (data) => {
        try {
            const conditions = {
                _id: data.LabDetailObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Result: data.Result,
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
                UserObjectId: data.UserObjectId,
            };
            const result = await LabDetailModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    infoLab: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                _id: data.LabDetailObjectId,
            };
            const fieldsSelect = '_id LabType Result';
            const result = LabDetailModel.find(conditions).select(fieldsSelect);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    infoLabObjectId: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                _id: data.LabDetailObjectId,
            };
            const fieldsSelect = 'LabObjectId';
            const result = LabDetailModel.find(conditions).select(fieldsSelect);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
