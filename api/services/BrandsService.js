const BrandModel = require('../models/Brands');
const {
    generatorTime,
    promiseReject,
    escapeRegExp,
    trimValue,
    promiseResolve,
    compareValue,
} = require('../libs/shared');
const { STATUS, DELETE_FLAG} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                BrandName: data.BrandName,
                BrandCode: data.BrandCode,
                Description: data.Description || '',
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await BrandModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkBrandCodeExist: async (data) => {
        try {
            const conditions = {
                BrandCode: data.BrandCode,
            };
            const result = await BrandModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.BrandObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    list: async (data) => {
        try {
            const page = +data.Page || 1;
            const limit = +data.Limit || 10;
            const sortKey = data.SortKey || 'CreatedDate';
            const sortOrder = data.SortOrder || -1;
            const search = trimValue(data.Search) || '';
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { BrandName: regex },
                    { BrandCode: regex }];
            }
            const fieldsSelect = 'BrandName BrandCode Description Status CreatedDate';
            const options = {
                sort: {
                    [sortKey]: sortOrder,
                },
                lean: true,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                select: fieldsSelect,
            };
            const result = BrandModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listActive: async () => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelect = '_id BrandName BrandCode';
            const result = BrandModel.find(conditions).select(fieldsSelect);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.BrandObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                BrandName: data.BrandName,
                BrandCode: data.BrandCode,
                Description: data.Description || '',
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await BrandModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateStatus: async (data) => {
        try {
            const conditions = {
                _id: data.BrandObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Status: STATUS[+data.Status],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await BrandModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    delete: async (data) => {
        try {
            const conditions = {
                _id: data.BrandObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                DeleteFlag: DELETE_FLAG[300],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await BrandModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
