
const LabDetailsService = require('../services/LabDetailsService');
const LabsService = require('../services/LabsService');
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
    FIELDS_IMPORT, STATUS,
} = require('../constants/constants');
const uploadExcel = uploadFile(storage('excels'), fileFilterExcel, 'FileExcel');


module.exports = {
    importFile: async (req, res) => {
        beforeUpload(req, res, async () => {
            try {
                // kiem tra file
                if (!req.file || !req.file.filename) {
                    return res.json(responseError(40002));
                }
                const LabDetailObjectId = req.body.LabDetailObjectId;
                const { data } = readFileExcel(req.file.path, {header: 'A'});
                const { Database, UserObjectId } = req.decoded;
                let recordAdded = 0;
                let recordUpdated = 0;
                let RowUpdated = [];
                const listError = [];
                const listCorrect = [];
                let hasRowError = false;

                const {
                    Param, Value, Range, Unit
                } = FIELDS_IMPORT;

                async function runArrayImported(array = []) {
                    console.log('aaa', array)
                    function checkLabDetail(Pram, Value, Range, Unit) {
                        const obj = {
                            msg: '',
                            value: [],
                        };
                        const _Pram = trimValue(Pram);
                        if (!_Pram) {
                            obj.msg = 'Chỉ số không được để rtrống, ';
                            return obj;
                        }
                        const _Value = trimValue(Value);
                        if (!_Value) {
                            obj.msg = 'Giá trị không được để trống, ';
                            return obj;
                        }
                        const _Range = trimValue(Range);
                        const _Unit = trimValue(Unit);
                        const Result = {};
                        Result.key = _Pram,
                        Result.value = _Value,
                        Result.range = _Range,
                        Result.unit = _Unit,
                        obj.value = Result;
                        console.log('ddd', Result)
                        return obj;
                    }

                    let idx = 6;
                    const len = array.length;
                    const arr = [];
                    for (let i = 6; i < len; i++) {
                        const row = array[i];
                        console.log('cccc', row)
                        for(const prop in row){
                            row[trimValue(prop)] = row[prop];
                        }
                        const params = {};
                        let msgError = '';
                        const detail = checkLabDetail(row['A'], row['B'], row['C'], row['D']);
                        msgError += detail.msg;
                        // arr.push(detail.value)
                        params.Result = arr;
                        console.log('bbb', arr)
                        // push vao list correct neu khong co loi
                        if (!hasRowError && !isEmpty(msgError)) {
                            hasRowError = true;
                        }
                        if(!hasRowError){
                            params.row = idx;
                            listCorrect.push(detail.value);
                        }
                        idx++;              
                    }
                }
                // run array import
                await runArrayImported(data);

                if (!hasRowError) {
                    const recordsCreated = [];
                    const DateCurrent = generatorTime();
                    const len = listCorrect.length;
                    const paramsUpdate = {};
                    paramsUpdate.LabDetailObjectId = LabDetailObjectId;
                    paramsUpdate.Result = listCorrect;
                    paramsUpdate.UpdatedBy = UserObjectId;
                    paramsUpdate.UserObjectId = UserObjectId;
                    paramsUpdate.UpdatedDate = DateCurrent;
                    const isUpdated = await LabDetailsService.updateImportFile(paramsUpdate);
                    // for (let i = 0; i < len; i++) {
                    //     const item = listCorrect[i];
                    //     item.LabDetailObjectId = LabDetailObjectId;
                    //     item.UpdatedBy = UserObjectId;
                    //     item.UserObjectId = UserObjectId;
                    //     item.UpdatedDate = DateCurrent;
                    //     const isUpdated = await LabDetailsService.updateImportFile(item);
                    //     RowUpdated = !isEmpty(isUpdated) ? [...RowUpdated, item.row] : RowUpdated;
                    //     continue;
                    // }
                }

                if (req.file.path) {
                    await deleteFile(req.file.path);
                }

                recordUpdated = RowUpdated.length;
                const result = {};
                const infoLab = await LabDetailsService.infoLabObjectId({LabDetailObjectId: req.body.LabDetailObjectId})
                const paramsupdateStatusLab = {
                    LabObjectId: infoLab[0].LabObjectId,
                    Status: 400,
                    UpdatedBy: req.decoded.UserObjectId
                };
                const updateStatusLab = await LabsService.updateStatus(paramsupdateStatusLab);
                if (isEmpty(updateStatusLab)) {
                    return res.json(responseError(40152, err));
                }
                return res.json(responseSuccess(10007, result));
            } catch (errors) {
                console.log(errors)
                if (req.file && req.file.path) {
                    deleteFile(req.file.path);
                }
                return resJsonError(res, errors, 'lab_details');
            }
        }, uploadExcel);
    },
    infoLab: async (req, res) => {
        try {
            const result = await LabDetailsService.infoLab(req.query);
            return res.json(responseSuccess(10161, result));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'lab_details');
        }
    },
};
