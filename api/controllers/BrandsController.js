const BrandsService = require('../services/BrandsService');
const {
    listValidator,
    updateStatusValidator,
    createValidator,
    updateValidator,
    BrandObjectIdValidator,
} = require('../validators/BrandValidator');

const {
    isEmpty,
    responseError,
    responseSuccess,
    getParamsWriteLog,
    resJsonError,
} = require('../libs/shared');

module.exports = {
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await BrandsService.list(req.query);
            return res.json(responseSuccess(10121, result));
        } catch (errors) {
            return resJsonError(res, errors, 'brand');
        }
    },
    // listActive: async (req, res) => {
    //     try {
    //         req.query.Database = req.decoded.Database;
    //         const result = await BrandsService.listActive(req.query);
    //         return res.json(responseSuccess(10771, result));
    //     } catch (errors) {
    //         return resJsonError(res, errors, 'brand');
    //     }
    // },
    create: async (req, res) => {
        try {
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.Database = req.decoded.Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            const existCode = await BrandsService.checkBrandCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40111));
            }
            const result = await BrandsService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10120));
            }
            return res.json(responseError(40110));
        } catch (errors) {
            return resJsonError(res, errors, 'brand');
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
            const existCode = await BrandsService.checkBrandCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40111));
            }
            const result = await BrandsService.update(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10122));
            }
            return res.json(responseError(40112));
        } catch (errors) {
            return resJsonError(res, errors, 'brand');
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
            const result = await BrandsService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10123));
            }
            return res.json(responseError(40113));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'brand');
        }
    },
    delete: async (req, res) => {
        try {
            req.checkBody(BrandObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdateBy = req.decoded.UserObjectId;
            const result = await BrandsService.delete(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10124));
            }
            return res.json(responseError(40114));
        } catch (errors) {
            return resJsonError(res, errors, 'brand');
        }
    },
};
