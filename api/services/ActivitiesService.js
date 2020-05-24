const ActivityModel = require('../models/Activities');
const {
    promiseReject,
    promiseResolve,
    convertToTime,
    trimValue,
    convertToObjectId,
    escapeRegExp,
    isEmpty,
    lookupAggre,
    unwindAggre
} = require('../libs/shared');
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
    listByPatient: async (data) => {
        try {
            const search = trimValue(data.Search);
            const page = +data.Page || 1;
            const limit = +data.Limit || 10;
            const skip = (page - 1) * limit;
            const sortKey = data.SortKey || 'CreatedDate';
            const sortOrder = +data.SortOrder || -1;
            const match = {
                DeleteFlag: DELETE_FLAG[200],
                PatientObjectId: convertToObjectId(data.PatientObjectId),
            };
            if (data.FromDate || data.ToDate) {
                match.CreatedDate = {};
                if (data.FromDate) {
                    match.CreatedDate.$gte = convertToTime(data.FromDate, 'from');
                }
                if (data.ToDate) {
                    match.CreatedDate.$lte = convertToTime(data.ToDate, 'to');
                }
            }
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { ActivityName: regex }];
            }
            const pipelineCount = [
                {$match: match},
                {$group: 
                    {_id: {$substr: ['$CreatedDate', 0, 10]}}
                },
                {$count: 'total'},
            ];
            const resultCount = await ActivityModel.aggregate(pipelineCount) || [];
            const totalRecord = !isEmpty(resultCount) ? resultCount[0].total : 0;
            const pages = Math.ceil(totalRecord / limit);
            const response = {
                docs: [],
                total: totalRecord,
                limit,
                page,
                pages,
            };
            if (!isEmpty(totalRecord)) {
                const pipeline = [
                    {$match: match},
                    {
                        $sort: {
                            [sortKey]: sortOrder,
                        },
                    },
                ];
                const fieldsPushed = {
                    ActivityName: '$ActivityName',
                    Time: '$CreatedDate',
                    User: '$User.Info.FullName'
                };
                const group = {
                    _id: {
                        CreatedDate: {$substr: ['$CreatedDate', 0, 10]},
                    },
                    Activities: {
                        $push: fieldsPushed,
                    },
                };
                const lookupUser = lookupAggre('users', 'UserObjectId', '_id', 'User');
                const unwindUser = unwindAggre('$User');
                const project = {
                    _id: 0,
                    CreatedDate: '$_id.CreatedDate',
                    Activities: 1,
                };
                pipeline.push(
                    {$lookup: lookupUser},
                    {$group: group},
                    {$unwind: unwindUser},
                    {$project: project},
                    {$skip: skip },
                    {$limit: limit},
                );
                console.log(pipeline)
                const result = await ActivityModel.aggregate(pipeline);
                response.docs = result;
            }
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
