const PatientModel = require('../models/Patients');
const {STATUS, DELETE_FLAG} = require('../constants/constants');
const {
    generatorTime,
    compareValue,
    promiseReject,
    promiseResolve,
    convertToArrayObjectId,
    trimValue,
    escapeRegExp,
    convertToTime,
    convertToObjectId,
    isArray,
    RegExpSearch,
    formatDateToYM,
    getYMCurrent,
} = require('../libs/shared');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                FullName: data.FullName,
                PatientID: data.PatientID,
                Mobile: data.Mobile,
                Sex: data.Sex,
                Address: {
                    ProvinceObjectId: data.Address.ProvinceObjectId,
                    DistrictObjectId: data.Address.DistrictObjectId,
                    WardObjectId: data.Address.WardObjectId,
                    Street: data.Address.Street || '',
                },
                Contact: data.Contact || [],
                Age: data.Age,
                DateOfBirth: data.DateOfBirth,
                Career: data.Career,
                Reason: data.Reason,
                CreatedBy: data.CreatedBy,
                CreatedDate: generatorTime(),
            };
            const result = await PatientModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            console.log(err)
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.PatientObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                FullName: data.FullName,
                Mobile: data.Mobile,
                Sex: data.Sex,
                Address: {
                    ProvinceObjectId: data.Address.ProvinceObjectId,
                    DistrictObjectId: data.Address.DistrictObjectId,
                    WardObjectId: data.Address.WardObjectId,
                    Street: data.Address.Street || '',
                },
                Age: data.Age,
                DateOfBirth: data.DateOfBirth,
                Career: data.Career,
                Reason: data.Reason,
                UpdatedBy: data.UpdatedBy,
                UpdatedDate: generatorTime(),
            };
            const result = await PatientModel.findOneAndUpdate(conditions, set, { new: true});
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
            const status = data.Status ? data.Status : 0;
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            if (status) {
                conditions.Status = STATUS[+status];
            }
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { FullName: regex },
                    { PatientID: regex }];
            }
            if (data.FromDate || data.ToDate) {
                conditions.CreatedDate = {};
                if (data.FromDate) {
                    conditions.CreatedDate.$gte = convertToTime(data.FromDate, 'from');
                }
                if (data.ToDate) {
                    conditions.CreatedDate.$lte = convertToTime(data.ToDate, 'to');
                }
            }
            if (data.ProvinceObjectId) {
                conditions['Address.ProvinceObjectId'] = {$in: convertToArrayObjectId(data.ProvinceObjectId)};
            }
            if (data.Districts) {
                conditions['Address.DistrictObjectId'] = {$in: convertToArrayObjectId(data.Districts)};
            }
            const fieldsSelect = '_id PatientID FullName Mobile Sex Age DateOfBirth Career Address.Street CreatedBy CreatedDate Status Reason Contact';
            const populate = [{
                path: 'Address.ProvinceObjectId',
                select: '_id ProvinceName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'Address.DistrictObjectId',
                select: '_id DistrictName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }, 
            {
                path: 'Address.WardObjectId',
                select: '_id WardName',
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
            const result = PatientModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateStatus: async (data) => {
        try {
            const conditions = {
                _id: data.PatientObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Status: STATUS[+data.Status],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await PatientModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkPatientIDExist: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                PatientID: data.PatientID,
            };
            const result = await PatientModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.PatientObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getAutoIncrementNewest: async (data) => {
        try {
            const result = await PatientModel.findOne().select('AutoIncrement').sort({_id: -1});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkPatientExist: async (data) => {
        try {
            const conditions = {
                FullName: data.FullName,
                DateOfBirth: data.DateOfBirth,
                'Address.ProvinceObjectId': data.Address.ProvinceObjectId,
                'Address.DistrictObjectId': data.Address.DistrictObjectId,
                'Address.WardObjectId': data.Address.WardObjectId,
                'Address.Street': data.Address.Street,
                DeleteFlag: DELETE_FLAG[200],
            };
            const result = await PatientModel.findOne(conditions);
            if (result) {
                if (compareValue(result.PatientID, data.PatientID)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getStatuses: async (data) => {
        try {
            const match = {
                DeleteFlag: DELETE_FLAG[200],
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
            if (data.ProvinceObjectId) {
                match['Address.ProvinceObjectId'] = {$in: convertToArrayObjectId(data.ProvinceObjectId)};
            }
            if (data.Districts) {
                match['Address.DistrictObjectId'] = {$in: convertToArrayObjectId(data.Districts)};
            }
            const group = {
                _id: '$Status',
                total: { $sum: 1 },
            };
            const project = {
                _id: 0,
                Status: '$_id',
                total: 1,
            };
            const pipeline = [
                { $match: match },
                { $group: group },
                { $project: project },
            ];
            const result = await PatientModel.aggregate(pipeline) || [];
            const response = result.reduce((obj, item) => {
                obj[item.Status] += item.total;
                return obj;
            }, {InProcess: 0, WaitingAccepted: 0, Done: 0});
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listActive: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelected = '_id FullName PatientID Age';
            const options = {
                sort: {
                    _id: -1,
                },
                lean: true,
                select: fieldsSelected,
            };
            const result = await PatientModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    info: async (data) => {
        try {
            const conditions = {
                _id: convertToObjectId(data.PatientObjectId),
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelect = '_id PatientID FullName Mobile Sex Age DateOfBirth Address.Street Reason HealthStatus Diagnose';
            const populate = [{
                path: 'Address.ProvinceObjectId',
                select: '_id ProvinceName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'Address.DistrictObjectId',
                select: '_id DistrictName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }, 
            {
                path: 'Address.WardObjectId',
                select: '_id WardName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }];
            const result = await PatientModel.findOne(conditions).select(fieldsSelect).populate(populate);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateHealthStatus: async (data) => {
        try {
            const conditions = {
                _id: data.PatientObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                HealthStatus: {
                    Height: data.HealthStatus.Height || '',
                    Weight: data.HealthStatus.Weight || '',
                    BMI: data.HealthStatus.BMI || '',
                    BloodGroup: data.HealthStatus.BloodGroup || '',
                    BloodPressure: data.HealthStatus.BloodPressure || '',
                    Allergy: data.HealthStatus.Allergy || '',
                    MedicalHis: data.HealthStatus.MedicalHis || '',
                    DiseaseHis: data.HealthStatus.DiseaseHis || '',
                },
                UpdatedBy: data.UpdatedBy,
                UpdatedDate: generatorTime(),
            };
            const result = await PatientModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    // updateDiagnose: async (data) => {
    //     try {
    //         const conditions = {
    //             _id: data.PatientObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //                 Diagnose: data.Diagnose,
    //             UpdatedBy: data.UpdatedBy,
    //             UpdatedDate: generatorTime(),
    //         };
    //         const result = await PatientModel.findOneAndUpdate(conditions, set, { new: true});
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    countPatient: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            const result = await PatientModel.count(conditions);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    patientByDate: async (data) => {
        try {
            const match = {
                DeleteFlag: DELETE_FLAG[200],
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
            const group = {
                _id: {
                    Date: { $substr: ['$CreatedDate', 0, 10] },
                },
                TotalPatient: {
                    $sum: 1,
                },
            };
            const project = {
                _id: 0,
                Date: '$_id.Date',
                TotalPatient: 1,
            };
            const pipeline = [
                { $match: match },
                { $group: group },
                { $project: project },
            ];
            const result = await PatientModel.aggregate(pipeline);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    patientByMonth: async (data) => {
        try {
            const match = {
                DeleteFlag: DELETE_FLAG[200],
            };
            if (data.Month) {
                if (isArray(data.Month)) {
                    match.$or = [];
                    data.Month.map((month) => {
                        match.$or.push({
                            CreatedDate: RegExpSearch(formatDateToYM(month)),
                        });
                    });
                } else {
                    match.CreatedDate = RegExpSearch(formatDateToYM(data.Month));
                }
            } else {
                const Month = getYMCurrent;
                match.CreatedDate = RegExpSearch(Month);
            }
            const group = {
                _id: {
                    Month: { $substr: ['$CreatedDate', 0, 7] },
                    // sub string created date to yyyy-mm
                },
                TotalPatient: {
                    $sum: 1,
                },
            };
            const project = {
                _id: 0,
                Month: '$_id.Month',
                TotalPatient: 1,
            };
            const pipeline = [
                { $match: match },
                { $group: group },
                { $project: project },
            ];
            const result = await PatientModel.aggregate(pipeline);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listExport: async (data) => {
        try {
            const sortKey = data.SortKey ? data.SortKey : 'CreatedDate';
            const sortOrder = data.SortOrder ? data.SortOrder : -1;
            const conditions = {
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
            const fieldsSelect = '_id PatientID FullName Mobile Sex Age DateOfBirth Career Address.Street CreatedBy CreatedDate Status Reason Contact';
            const populate = [{
                path: 'Address.ProvinceObjectId',
                select: '_id ProvinceName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'Address.DistrictObjectId',
                select: '_id DistrictName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }, 
            {
                path: 'Address.WardObjectId',
                select: '_id WardName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }];
            const options = {
                sort: {
                    [sortKey]: sortOrder,
                },
                select: fieldsSelect,
                populate: populate,
            };
            const result = PatientModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
