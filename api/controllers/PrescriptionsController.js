
const PrescriptionsService = require('../services/PrescriptionsService');
const {
    createValidator,
    listValidator,
} = require('../validators/PrescriptionValidator');

const {
    isEmpty,
    responseSuccess,
    responseError,
    padNumber,
    resJsonError,
    generatorTime,
} = require('../libs/shared');

// create new patientID 
async function createNewPrescriptionCode(AutoIncrement, Database) {
    ++AutoIncrement;
    let PrescriptionCode = padNumber(+AutoIncrement);
    const existPrescriptionCode = await PrescriptionsService.checkPrescriptionCodeExist({
        Database, PrescriptionCode,
    });
    if (existPrescriptionCode) {
        PrescriptionCode = +PrescriptionCode;
        return await createNewPrescriptionCode(PrescriptionCode, Database);
    }
    return padNumber(PrescriptionCode);
}

module.exports = {
    create: async (req, res) => {
        try {
            const {Database} = req.decoded;
            req.body.Database = Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            const recordNewest = await PrescriptionsService.getAutoIncrementNewest({Database});
            const AutoIncrement = !isEmpty(recordNewest) ? (recordNewest.AutoIncrement || 0) : 0;
            req.body.PrescriptionCode = await createNewPrescriptionCode(AutoIncrement, Database);
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await PrescriptionsService.create(req.body);
            if (!isEmpty(result)) {;
                return res.json(responseSuccess(10170));
            }
            return res.json(responseError(40170));
        } catch (errors) {
            return resJsonError(res, errors, 'precriptions');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await PrescriptionsService.list(req.query);
            return res.json(responseSuccess(10181, result));
        } catch (errors) {
            return resJsonError(res, errors, 'precriptions');
        }
    },
};
