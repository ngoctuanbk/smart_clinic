const ActivityModel = require('../models/Activities');
const {
    promiseReject,
    promiseResolve,
    convertToTime,
ss} = require('../libs/shared');
const { DELETE_FLAG} = require('../constants/constants');

module.exports = {
    create: async function (data) { // eslint-disable-line
        try {
            const result = await ActivityModel.create(data.records);
            console.log(result)
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
                PatientObjectId: data.PatientObjectId,
                DeleteFlag: DELETE_FLAG[200],
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
            const fieldsSelect = 'ActivityName CreatedDate';
            const populate = {
                path: 'UserObjectId',
                select: '_id Info UserCode',
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
            const result = ActivityModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
