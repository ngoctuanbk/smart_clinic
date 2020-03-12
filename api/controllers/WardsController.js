const WardsService = require('../services/WardsService');
const {
    createValidator,
    DistrictObjectIdValidator,
} = require('../validators/WardValidator');

const {
    responseError,
    responseSuccess,
    isEmpty,
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
            const existCode = await WardsService.checkWardCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40127));
            }
            const result = await WardsService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10132));
            }
            return res.json(responseError(40126));
        } catch (errors) {
            return resJsonError(res, errors, 'ward');
        }
    },  
    listActiveByDistrict: async (req, res) => {
        try {
            req.checkQuery(DistrictObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.query.Database = req.decoded.Database;
            const result = await WardsService.listActiveByDistrict(req.query);
            return res.json(responseSuccess(10135, result));
        } catch (errors) {
            return resJsonError(res, errors, 'ward');
        }
    },
};
