const MedicineModel = require('../models/Medicines');
const {
    generatorTime,
    promiseReject,
    escapeRegExp,
    trimValue,
    promiseResolve,
    compareValue,
    formatDateToYMD,
} = require('../libs/shared');
const { STATUS, DELETE_FLAG} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                MedicineName: data.MedicineName,
                MedicineCode: data.MedicineCode,
                BrandObjectId: data.BrandObjectId,
                Price: data.Price,
                Unit: data.Unit,
                Quantity: data.Quantity,
                LotNumber: data.LotNumber,
                MFG: formatDateToYMD(data.MFG) || '',
                EXP: formatDateToYMD(data.EXP) || '',
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await MedicineModel.create(set);
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
                    { MedicineName: regex },
                    { MedicineCode: regex }];
            }
            if (data.BrandObjectId) {
                conditions.BrandObjectId = data.BrandObjectId;
            }
            const fieldsSelect = 'MedicineCode MedicineName property Price Unit Quantity LotNumber EXP MFG Status CreatedDate';
            const populate = {
                path: 'BrandObjectId',
                select: '_id BrandName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }
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
            const result = MedicineModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.MedicineObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                MedicineName: data.MedicineName,
                MedicineCode: data.MedicineCode,
                BrandObjectId: data.BrandObjectId,
                Price: data.Price,
                MFG: formatDateToYMD(data.MFG) || '',
                EXP: formatDateToYMD(data.EXP) || '',
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await MedicineModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkMedicineCodeExist: async (data) => {
        try {
            const conditions = {
                MedicineCode: data.MedicineCode,
            };
            const result = await MedicineModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.MedicineObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkMedicineNameExist: async (data) => {
        try {
            const conditions = {
                MedicineName: data.MedicineName,
            };
            const result = await MedicineModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.MedicineObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listActive: async () => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelect = '_id MedicineName MedicineCode Price Unit';
            const result = MedicineModel.find(conditions).select(fieldsSelect);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },

};
