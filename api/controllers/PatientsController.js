
const PatientsService = require('../services/PatientsService');
const {
    createValidator,
    listValidator,
    updateStatusValidator,
} = require('../validators/PatientValidator');

const {
    isEmpty,
    responseSuccess,
    responseError,
    padNumber,
    resJsonError,
} = require('../libs/shared');

// create new patientID 
async function createNewPatientID(AutoIncrement, Database) {
    ++AutoIncrement;
    let PatientID = padNumber(+AutoIncrement);
    const existID = await PatientsService.checkPatientIDExist({
        Database, PatientID,
    });
    if (existID) {
        PatientID = +PatientID;
        return await createNewPatientID(PatientID, Database);
    }
    return padNumber(PatientID);
}

module.exports = {
    create: async (req, res) => {
        try {
            const {Database} = req.decoded;
            req.body.Database = Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            const recordNewest = await PatientsService.getAutoIncrementNewest({Database});
            const AutoIncrement = !isEmpty(recordNewest) ? (recordNewest.AutoIncrement || 0) : 0;
            req.body.PatientID = await createNewPatientID(AutoIncrement, Database);
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const existPatient = await PatientsService.checkPatientExist(req.body);
            if (existPatient) {
                return res.json(responseError(40131));
            }
            const result = await PatientsService.create(req.body);
            if (!isEmpty(result)) {;
                return res.json(responseSuccess(10140));
            }
            return res.json(responseError(40130));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'patient');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await PatientsService.list(req.query);
            const statuses = await PatientsService.getStatuses(req.query);
            result.CountDone = statuses.Done;
            result.CountInProcess = statuses.InProcess;
            result.CountWaitingAccepted = statuses.WaitingAccepted;
            return res.json(responseSuccess(10141, result));
        } catch (errors) {
            return resJsonError(res, errors, 'patient');
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
            const result = await PatientsService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10142));
            }
            return res.json(responseError(40132));
        } catch (errors) {
            return resJsonError(res, errors, 'patient');
        }
    },
    listActive: async (req, res) => {
        try {
            const result = await PatientsService.listActive(req.query);
            return res.json(responseSuccess(10141, result));
        } catch (errors) {
            return resJsonError(res, errors, 'user');
        }
    },
};
