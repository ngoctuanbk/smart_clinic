
const LabsService = require('../services/LabsService');
const LabDetailsService = require('../services/LabDetailsService');
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
    trimValue,
    deleteFile,
    beforeUpload,
    readFileExcel,
    uploadFile,
    storage,
    fileFilterExcel,
} = require('../libs/shared');
const {
    FIELDS_IMPORT,
} = require('../constants/constants');
const uploadExcel = uploadFile(storage('excels'), fileFilterExcel, 'FileExcel');

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
            const LabDetails = req.body.LabDetail;
            const resultLab = await LabsService.create(req.body);
            if (!isEmpty(resultLab)) {
                const LabObjectId = resultLab._id;
                LabDetails.map((detail) => {
                    detail.LabObjectId = LabObjectId;
                    return detail;
                });
                await LabDetailsService.createMany({records: LabDetails});
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
    listByPatient: async (req, res) => {
        try {
            req.checkQuery(PatientObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await LabsService.listByPatient(req.query);
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
    importFile: async (req, res) => {
        beforeUpload(req, res, async () => {
            try {
                // kiem tra file
                if (!req.file || !req.file.filename) {
                    return res.json(responseError(40002));
                }
                const LabObjectId = req.body.LabObjectId;
                const { data } = readFileExcel(req.file.path);
                const { Database, UserObjectId } = req.decoded;
                let recordAdded = 0;
                let recordUpdated = 0;
                let RowUpdated = [];
                const listError = [];
                const listCorrect = [];

                const {
                    LabType, Result
                } = FIELDS_IMPORT;

                async function runArrayImported(array = []) {

                    function checkLabDetail(LabType, Result) {
                        const obj = {
                            msg: '',
                            value: [],
                        };
                        const _LabType = trimValue(LabType);
                        if (!_LabType) {
                            obj.msg = 'Loại xét nghiệm không được để r=trống, ';
                            return obj;
                        }
                        const _Result = trimValue(Result);
                        if (!_Result) {
                            obj.msg = 'Kết quả xét nghiệm không được để r=trống, ';
                            return obj;
                        }
                        const LabDetail = {};
                        LabDetail.LabType = _LabType,
                        LabDetail.Result = _Result,
                        obj.value = LabDetail;
                        return obj;
                    }

                    let idx = 2;
                    const len = array.length;
                    const arr = [];
                    for (let i = 0; i < len; i++) {
                        const row = array[i];
                        const params = {};
                        let msgError = '';
                        const detail = checkLabDetail(row[LabType], row[Result]);
                        msgError += detail.msg;
                        arr.push(detail.value)
                        params.LabDetail = arr;
                        // push vao list correct neu khong co loi
                        if (listError.length < 1 || isEmpty(msgError)) {
                            params.row = idx;
                            listCorrect.push(params);
                        }
                        idx++;              
                    }
                }
                // run array import
                await runArrayImported(data);

                if (!listError.length && listCorrect.length) {
                    const recordsCreated = [];
                    const DateCurrent = generatorTime();
                    const len = listCorrect.length;
                    for (let i = 0; i < len; i++) {
                        const item = listCorrect[i];
                        item.LabObjectId = LabObjectId;
                        item.UpdatedBy = UserObjectId;
                        item.UserObjectId = UserObjectId;
                        item.UpdatedDate = DateCurrent;
                        const isUpdated = await LabsService.updateImportFile(item);
                        RowUpdated = !isEmpty(isUpdated) ? [...RowUpdated, item.row] : RowUpdated;
                        continue;
                    }
                }

                if (req.file.path) {
                    await deleteFile(req.file.path);
                }

                recordUpdated = RowUpdated.length;
                const result = {};
                return res.json(responseSuccess(10007, result));
            } catch (errors) {
                console.log(errors)
                if (req.file && req.file.path) {
                    deleteFile(req.file.path);
                }
                return resJsonError(res, errors, 'question');
            }
        }, uploadExcel);
    },
    updateStatus: async (req, res) => {
        try {
            req.checkBody(updateStatusValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const infoPatient = await LabsService.infoPatient({LabObjectId: req.body.LabObjectId})
            if (req.body.Status === 200) {
                const paramsCreateActivity = {
                    records: [],
                };
                paramsCreateActivity.records.push({
                    ActivityName: 'Xét nghiệm cận lâm sàng',
                    UserObjectId: req.decoded.UserObjectId,
                    CreatedDate: generatorTime(),
                    PatientObjectId: infoPatient[0].PatientObjectId,
                });
                const activityCreated = await ActivitiesService.create(paramsCreateActivity) || [];
                    if (isEmpty(activityCreated)) {
                        return res.json(responseError(40153, err));
                    }
            }
            const result = await LabsService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10162));
            }
            return res.json(responseError(40152));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'lab');
        }
    },
};
