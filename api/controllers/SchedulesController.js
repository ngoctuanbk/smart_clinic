
const SchedulesService = require('../services/SchedulesService');
const {
    createValidator,
    listValidator,
    infoValidator,
    updateStatusValidator,
} = require('../validators/ScheduleValidator');

const {
    isEmpty,
    responseSuccess,
    responseError,
    padNumber,
    resJsonError,
} = require('../libs/shared');

module.exports = {
    create: async (req, res) => {
        try {
            const {Database} = req.decoded;
            req.body.Database = Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const existSchedule = await SchedulesService.checkScheduleExist(req.body);
            if (existSchedule) {
                return res.json(responseError(40141));
            }
            const result = await SchedulesService.create(req.body);
            if (!isEmpty(result)) {;
                return res.json(responseSuccess(10150));
            }
            return res.json(responseError(40140));
        } catch (errors) {
            return resJsonError(res, errors, 'schedule');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.query.Database = req.decoded.Database;
            const result = await SchedulesService.list(req.query);
            return res.json(responseSuccess(10151, result));
        } catch (errors) {
            console.log(errors);
            return resJsonError(res, errors, 'schedule');
        }
    },
    info: async (req, res) => {
        try {
            req.query.Database = req.decoded.Database;
            req.checkQuery(infoValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await SchedulesService.info(req.query);
            return res.json(responseSuccess(10152, result));
        } catch (errors) {
            return resJsonError(res, errors, 'schedule');
        }
    },
    updateStatus: async (req, res) => {
        try {
            req.checkBody(updateStatusValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.Database = req.decoded.Database;
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const result = await SchedulesService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10153, result));
            }
            return res.json(responseError(40142));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'schedule');
        }
    },
};
