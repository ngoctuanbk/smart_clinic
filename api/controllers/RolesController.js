
const util = require('util');
const RolesService = require('../services/RolesService');
const messages = require('../constants/messages');
const {
    createValidator,
} = require('../validators/RolesValidator');

const {
    isEmpty,
    responseSuccess,
    responseError,
    getParamsWriteLog,
    resJsonError,
} = require('../libs/shared');
const {
    ACTION,
} = require('../constants/constants');

const Model = 'roles';
const {
    Update,
    Create,
} = ACTION;
module.exports = {
    create: async (req, res) => {
        try {
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const {
                UserObjectId,
            } = req.decoded;
            req.body.CreatedBy = UserObjectId;
            const result = await RolesService.create(req.body);
            if (!isEmpty(result)) {
                // const LogName = 'Thêm mới role';
                // const paramsWriteLog = getParamsWriteLog(LogName, Model, req.body,
                //     Create, req.decoded, result._id);
                // await LogsService.create(paramsWriteLog);
                return res.json(responseSuccess(10100, result));
            }
            return res.json(responseError(40005));
        } catch (errors) {
            console.log(errors);
            return resJsonError(res, errors, 'role');
        }
    },
    listActive: async (req, res) => {
        try {
            const result = await RolesService.listActive(req.query);
            return res.json(responseSuccess(10101, result));
        } catch (errors) {
            return resJsonError(res, errors, 'role');
        }
    },
};
