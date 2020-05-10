const LabModel = require('../models/Labs');
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
                LabCode: data.LabCode,
                LabName: data.LabName,
                LabDetail: data.LabDetail,
                PatientObjectId: data.PatientObjectId,
                Note: data.Note || '',
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await LabModel.create(set);
            return promiseResolve(result);
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
                    { LabName: regex },
                    { LabCode: regex }];
            }
            if (data.LabType) {
                conditions['LabDetail.LabType'] = data.LabType;
            }
            if (data.PatientObjectId) {
                conditions.PatientObjectId = data.PatientObjectId;
            }
            const fieldsSelect = 'LabName LabCode LabDetail Status UpdatedDate CreatedDate';
            const populate = [{
                path: 'PatientObjectId',
                select: '_id FullName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'UserObjectId',
                select: '_id Info',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }];
            const options = {
                sort: {
                    [sortKey]: sortOrder,
                },
                lean: true,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                select: fieldsSelect,
                populate: populate,
            };
            const result = LabModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.LabObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                LabDetail: data.LabDetail,
                UserObjectId: data.UserObjectId,
                PatientObjectId: data.PatientObjectId,
                Status: STATUS[200],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await LabModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkLabCodeExist: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                LabCode: data.LabCode,
            };
            const result = await LabModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.LabObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getAutoIncrementNewest: async () => {
        try {
            const result = await LabModel.findOne().select('AutoIncrement').sort({_id: -1});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkLabExist: async (data) => {
        try {
            const conditions = {
                LabName: data.LabName,
                LabType: data.LabType,
                PatientObjectId: data.PatientObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const result = await LabModel.findOne(conditions);
            if (result) {
                if (compareValue(result.LabCode, data.LabCode)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
