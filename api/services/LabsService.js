const LabModel = require('../models/Labs');
const {
    generatorTime,
    promiseReject,
    escapeRegExp,
    trimValue,
    promiseResolve,
    compareValue,
    isEmpty,
    lookupAggre,
    unwindAggre,
    convertToObjectId,
} = require('../libs/shared');
const { STATUS, DELETE_FLAG} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                LabCode: data.LabCode,
                LabName: data.LabName,
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
            const fieldsSelect = 'LabName LabCode LabDetails Status UpdatedDate CreatedDate';
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
            },
            {
                path: 'LabDetails',
                select: 'LabType Result',
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
    updateImportFile: async (data) => {
        try {
            const conditions = {
                _id: data.LabObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                LabDetail: data.LabDetail,
                Status: STATUS[200],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
                UserObjectId: data.UserObjectId,
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
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { LabName: regex },
                    { LabCode: regex }];
            }
            const pipelineCount = [
                {$match: match},
                {$group: 
                    {_id: {$substr: ['$CreatedDate', 0, 10]}}
                },
                {$count: 'total'},
            ];
            const resultCount = await LabModel.aggregate(pipelineCount) || [];
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
                    LabObjectId: '$_id',
                    LabName: '$LabName',
                    LabCode: '$LabCode',
                    LabDetail: '$LabDetail',
                    Status: '$Status',
                    UpdatedDate: '$UpdatedDate',
                    CreatedDate: '$CreatedDate',
                    User: '$User.Info.FullName',
                    LabDetail: '$LabDetails'
                };
                const group = {
                    _id: {
                        CreatedDate: {$substr: ['$CreatedDate', 0, 10]},
                    },
                    Labs: {
                        $push: fieldsPushed,
                    },
                };
                const lookupUser = lookupAggre('users', 'UserObjectId', '_id', 'User');
                const unwindUser = unwindAggre('$User');
                const lookupDetail = lookupAggre('lab_details', '_id', 'LabObjectId', 'LabDetails');
                const project = {
                    _id: 0,
                    CreatedDate: '$_id.CreatedDate',
                    Labs: 1,
                };
                pipeline.push(
                    {$lookup: lookupUser},
                    {$lookup: lookupDetail},
                    {$group: group},
                    {$unwind: unwindUser},
                    {$project: project},
                    {$skip: skip },
                    {$limit: limit},
                );
                console.log(pipeline)
                const result = await LabModel.aggregate(pipeline);
                response.docs = result;
            }
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateStatus: async (data) => {
        try {
            const conditions = {
                _id: data.LabObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Status: STATUS[+data.Status],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await LabModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    infoPatient: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                _id: data.LabObjectId,
            };
            const fieldsSelect = 'PatientObjectId';
            const result = LabModel.find(conditions).select(fieldsSelect);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
