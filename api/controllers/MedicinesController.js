const MedicinesService = require('../services/MedicinesService');
const {
    listValidator,
    createValidator,
    updateValidator,
    updateStatusValidator,
    _idValidator
} = require('../validators/MedicinesValidator');

const {
    isEmpty,
    responseError,
    responseSuccess,
    getParamsWriteLog,
    resJsonError,
} = require('../libs/shared');

module.exports = {
    create: async (req, res) => {
        try {
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.Database = req.decoded.Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            const existCode = await MedicinesService.checkMedicineCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40161));
            }
            const existName = await MedicinesService.checkMedicineNameExist(req.body);
            if (existName) {
                return res.json(responseError(40162));
            }
            const result = await MedicinesService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10170));
            }
            return res.json(responseError(40160));
        } catch (errors) {
            return resJsonError(res, errors, 'medicine');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await MedicinesService.list(req.query);
            return res.json(responseSuccess(10171, result));
        } catch (errors) {
            return resJsonError(res, errors, 'medicine');
        }
    },
    listActive: async (req, res) => {
        try {
            const result = await MedicinesService.listActive(req.query);
            return res.json(responseSuccess(10171, result));
        } catch (errors) {
            return resJsonError(res, errors, 'medicine');
        }
    },
    update: async (req, res) => {
        try {
            req.checkBody(updateValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const existCode = await MedicinesService.checkMedicineCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40161));
            }
            const existName = await MedicinesService.checkMedicineNameExist(req.body);
            if (existName) {
                return res.json(responseError(40162));
            }
            const result = await MedicinesService.update(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10172));
            }
            return res.json(responseError(40163));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'medicine');
        }
    },
    updateStatus: async (req, res) => {
        try {
            req.checkBody(updateStatusValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const result = await MedicinesService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10123));
            }
            return res.json(responseError(40113));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'medicine');
        }
    },
    delete: async (req, res) => {
        try {
            req.checkBody(_idValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdateBy = req.decoded.UserObjectId;
            const result = await MedicinesService.delete(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10124));
            }
            return res.json(responseError(40114));
        } catch (errors) {
            return resJsonError(res, errors, 'medicine');
        }
    },
};
