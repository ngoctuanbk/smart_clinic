const DiagnosesService = require('../services/DiagnosesService');

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
            const result = await DiagnosesService.list(req.query);
            return res.json(responseSuccess(10121, result));
        } catch (errors) {
            return resJsonError(res, errors, 'diagnose');
        }
    },
    create: async (req, res) => {
        try {
            req.body.Database = req.decoded.Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            req.body.UserObjectId = req.decoded.UserObjectId;
            const result = await DiagnosesService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10120));
            }
            return res.json(responseError(40110));
        } catch (errors) {
            return resJsonError(res, errors, 'diagnose');
        }
    },
    update: async (req, res) => {
        try {
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const result = await DiagnosesService.update(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10122));
            }
            return res.json(responseError(40112));
        } catch (errors) {
            return resJsonError(res, errors, 'brand');
        }
    },
};
