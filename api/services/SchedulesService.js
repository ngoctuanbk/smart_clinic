const ScheduleModel = require('../models/Schedules');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {
    generatorTime,
    compareValue,
    promiseReject,
    promiseResolve,
    formatDateToYMD,
    convertToArrayObjectId,
    trimValue,
    getYearCurrent,
    RegExpSearch,
    isEmpty,
    escapeRegExp,
    convertToTime,
    convertToObjectId,
} = require('../libs/shared');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                PatientObjectId: data.PatientObjectId,
                UserObjectId: data.UserObjectId,
                Date: formatDateToYMD(data.Date),
                TimeWorkStart: data.TimeWorkStart || '',
                TimeWorkEnd: data.TimeWorkEnd || '',
                CreatedBy: data.CreatedBy,
                CreatedDate: generatorTime(),
                Note: data.Note || '',
            };
            const result = await ScheduleModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    list: async (data) => {
        try {
            const search = trimValue(data.Search);
            const page = +data.Page || 1;
            const limit = +data.Limit || 10;
            const skip = (page - 1) * limit;
            const sortKey = data.SortKey || 'CreatedDate';
            const sortOrder = +data.SortOrder || -1;
            const match = {
                DeleteFlag: DELETE_FLAG[200],
                $or: [],
            };
            if (data.Month) {
                const _s = `${getYearCurrent}-${data.Month}`;
                const searchMonth = RegExpSearch(_s);
                match.$and = [{ Date: searchMonth }];
            }
            if (search) {
                const regex = RegExpSearch(search);
                match.$or.push(
                    { ShiftCode: regex},
                    { ShiftName: regex},
                );
            }
            if (isEmpty(match.$or)) {
                delete match.$or;
            }
            const pipelineCount = [
                { $match: match },
                { $group: { _id: '$UserObjectId' } },
                { $count: 'total' },
            ];
            const resultCount = await ScheduleModel.aggregate(pipelineCount) || [];
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
                    { $match: match },
                    {
                        $sort: {
                            [sortKey]: sortOrder,
                        },
                    },
                ];
                const fieldsPushed = {
                    Date: '$Date',
                    TimeWorkStart: '$TimeWorkStart',
                    TimeWorkEnd: '$TimeWorkEnd',
                    Status: '$Status',
                    ScheduleObjectId: '$_id',
                };
                const lookup = {
                    from: 'patients',
                    localField: 'PatientObjectId',
                    foreignField: '_id',
                    as: 'Patient',
                };
                const unwind = {
                    path: '$Patient',
                    preserveNullAndEmptyArrays: true,
                };
                pipeline.push({ $lookup: lookup });
                pipeline.push({ $unwind: unwind });
                fieldsPushed.Patient = '$Patient.FullName';
                fieldsPushed.PatientID = '$Patient.PatientID';
                const group = {
                    _id: '$UserObjectId',
                    Schedules: {
                        $push: fieldsPushed,
                    },
                };
                const lookupUser = {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'User',
                };
                const unwindUser = {
                    path: '$User',
                };
                const project = {
                    _id: 0,
                    UserName: '$User.UserName',
                    FullName: '$User.Info.FullName',
                    Schedules: 1,
                };
                pipeline.push(
                    { $group: group },
                    { $lookup: lookupUser },
                    { $unwind: unwindUser },
                    { $project: project },
                    { $limit: limit },
                    { $skip: skip },
                );
                const result = await ScheduleModel.aggregate(pipeline);
                response.docs = result;
            }
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkScheduleExist: async (data) => {
        try {
            const conditions = {
                UserObjectId: data.UserObjectId,
                PatientObjectId: data.PatientObjectId,
                Date: formatDateToYMD(data.Date),
                DeleteFlag: DELETE_FLAG[200],
            };
            const result = await ScheduleModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.ScheduleObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    info: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                _id: convertToObjectId(data.ScheduleObjectId),
            };
            const fields = {
                Date: 1,
                TimeWorkStart: 1,
                TimeWorkEnd: 1,
                UserObjectId: 1,
                PatientObjectId: 1,
                Note: 1,
                Status: 1,
            };
            const populate = [
                {path: 'PatientObjectId', select: '-_id FullName PatientID'},
                {path: 'UserObjectId', select: '-_id UserName Info'}];
            const result = ScheduleModel.findOne(conditions, fields).populate(populate);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateStatus: async (data) => {
        try {
            const conditions = {
                _id: data.ScheduleObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {};
            set.Status = STATUS[+data.Status];
            set.UpdatedDate = generatorTime();
            set.UpdatedBy = data.UpdatedBy;
            const result = await ScheduleModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
