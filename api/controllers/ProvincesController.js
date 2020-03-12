const ProvincesService = require('../services/ProvincesService');

const {
    createValidator,
} = require('../validators/ProvinceValidator');

const {
    isEmpty,
    responseError,
    responseSuccess,
    resJsonError,
} = require('../libs/shared');
module.exports = {
    create: async (req, res) => {
        try {
            req.body.Database = req.decoded.Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const existCode = await ProvincesService.checkProvinceCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40121));
            }
            const existName = await ProvincesService.checkProvinceNameExist(req.body);
            if (existName) {
                return res.json(responseError(40122));
            }
            const result = await ProvincesService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10130));
            }
            return res.json(responseError(40120));
        } catch (errors) {
            return resJsonError(res, errors, 'province');
        }
    },

    listActive: async (req, res) => {
        try {
            req.query.Database = req.decoded.Database;
            const result = await ProvincesService.listActive(req.query);
            return res.json(responseSuccess(10133, result));
        } catch (errors) {
            return resJsonError(res, errors, 'province');
        }
    },
};
