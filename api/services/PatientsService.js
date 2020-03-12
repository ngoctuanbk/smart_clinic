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
                Age: data.Age,
                DateOfBirth: data.DateOfBirth,
                Career: data.Career,
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
            const fieldsSelect = '_id PatientID FullName Mobile Sex Age DateOfBirth Career Address.Street CreatedBy CreatedDate Status';
            const populate = [{
                path: 'Address.ProvinceObjectId',
                select: '-_id ProvinceName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'Address.DistrictObjectId',
                select: '-_id DistrictName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }, 
            {
                path: 'Address.WardObjectId',
                select: '-_id WardName',
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
            }, {Active: 0, WaitingAccepted: 0, Inactive: 0});
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
