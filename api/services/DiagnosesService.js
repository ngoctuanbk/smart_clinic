const DiagnoseModel = require('../models/Diagnose');
const {
    generatorTime,
    promiseReject,
    escapeRegExp,
    trimValue,
    promiseResolve,
    compareValue,
    convertToTime,
} = require('../libs/shared');
const { STATUS, DELETE_FLAG} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                Type: data.Type,
                PatientObjectId: data.PatientObjectId,
                Description: data.Description || '',
                UserObjectId: data.UserObjectId,
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await DiagnoseModel.create(set);
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
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                PatientObjectId: data.PatientObjectId
            };
            if (data.FromDate || data.ToDate) {
                conditions.CreatedDate = {};
                if (data.FromDate) {
                    conditions.CreatedDate.$gte = convertToTime(data.FromDate, 'from');
                }
                if (data.ToDate) {
                    conditions.CreatedDate.$lte = convertToTime(data.ToDate, 'to');
                }
            }
            const fieldsSelect = 'Type Description CreatedDate';
            const populate = {
                path: 'UserObjectId',
                select: '_id Info',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            };
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
            const result = DiagnoseModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.DiagnoseObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Description: data.Description || '',
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await DiagnoseModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
