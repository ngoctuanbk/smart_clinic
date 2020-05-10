const PrescriptionModel = require('../models/Prescriptions');
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
                PrescriptionCode: data.PrescriptionCode,
                OrderDetail: data.OrderDetail,
                PatientObjectId: data.PatientObjectId,
                SumTotalPrice: data.SumTotalPrice,
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await PrescriptionModel.create(set);
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
            if (data.PatientObjectId) {
                conditions.PatientObjectId = data.PatientObjectId;
            }
            const fieldsSelect = 'PrescriptionCode SumTotalPrice CreatedDate Status OrderDetail';
            const populate = [{
                path: 'OrderDetail.MedicineObjectId',
                select: '_id MedicineName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'CreatedBy',
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
            const result = PrescriptionModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getAutoIncrementNewest: async () => {
        try {
            const result = await PrescriptionModel.findOne().select('AutoIncrement').sort({_id: -1});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkPrescriptionCodeExist: async (data) => {
        try {
            const conditions = {
                CreatedDate: data.CreatedDate,
                PatientObjectId: data.PatientObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const result = await PrescriptionModel.findOne(conditions);
            if (result) {
                if (compareValue(result.PrescriptionCode, data.PrescriptionCode)) {
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
