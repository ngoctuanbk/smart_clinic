const DistrictService = require('../services/DistrictService');
const ProvincesService = require('../services/ProvincesService');

const {
    createValidator,
    ProvinceObjectIdValidator,
} = require('../validators/DistrictValidator');

const {
    isEmpty,
    responseError,
    responseSuccess,
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
            const existCode = await DistrictService.checkDistrictCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40124));
            }
            const existName = await DistrictService.checkDistrictNameExist(req.body);
            if (existName) {
                return res.json(responseError(40125));
            }
            const result = await DistrictService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10131));
            }
            return res.json(responseError(40123));
        } catch (errors) {
            return resJsonError(res, errors, 'district');
        }
    },
    listActiveByProvince: async (req, res) => {
        try {
            req.checkQuery(ProvinceObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.query.Database = req.decoded.Database;
            const result = await DistrictService.listActiveByProvince(req.query);
            return res.json(responseSuccess(10134, result));
        } catch (errors) {
            return resJsonError(res, errors, 'district');
        }
    },
};
