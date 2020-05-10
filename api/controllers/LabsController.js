
const LabsService = require('../services/LabsService');
const ActivitiesService = require('../services/ActivitiesService');
const {
    createValidator,
    listValidator,
    updateStatusValidator,
    updateValidator,
    PatientObjectIdValidator,
} = require('../validators/LabValidator');

const {
    isEmpty,
    responseSuccess,
    responseError,
    padNumber,
    resJsonError,
    generatorTime,
} = require('../libs/shared');

// create new patientID 
async function createNewLabCode(AutoIncrement, Database) {
    ++AutoIncrement;
    let LabCode = padNumber(+AutoIncrement);
    const existLabCode = await LabsService.checkLabCodeExist({
        Database, LabCode,
    });
    if (existLabCode) {
        LabCode = +LabCode;
        return await createNewLabCode(LabCode, Database);
    }
    return padNumber(LabCode);
}

module.exports = {
    create: async (req, res) => {
        try {
            const {Database} = req.decoded;
            req.body.Database = Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            const recordNewest = await LabsService.getAutoIncrementNewest({Database});
            const AutoIncrement = !isEmpty(recordNewest) ? (recordNewest.AutoIncrement || 0) : 0;
            req.body.LabCode = await createNewLabCode(AutoIncrement, Database);
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await LabsService.create(req.body);
            if (!isEmpty(result)) {;
                return res.json(responseSuccess(10160));
            }
            return res.json(responseError(40150));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'lab');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await LabsService.list(req.query);
            return res.json(responseSuccess(10161, result));
        } catch (errors) {
            return resJsonError(res, errors, 'lab');
        }
    },
    update: async (req, res) => {
        try {
            req.checkBody(updateValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UserObjectId = req.decoded.UserObjectId;
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const paramsCreateActivity = {
                records: [],
            };
            paramsCreateActivity.records.push({
                ActivityName: 'Xét nghiệm cận lâm sàng',
                UserObjectId: req.body.UserObjectId,
                CreatedDate: generatorTime(),
                PatientObjectId: req.body.PatientObjectId,
            });
            const activityCreated = await ActivitiesService.create(paramsCreateActivity) || [];
                if (isEmpty(activityCreated)) {
                    return res.json(responseError(40153, err));
                }
            const result = await LabsService.update(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10162));
            }
            return res.json(responseError(40152));
        } catch (errors) {
            return resJsonError(res, errors, 'lab');
        }
    },
};
