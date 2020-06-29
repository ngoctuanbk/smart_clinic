/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-dupe-keys */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const empty = require('is-empty');
const moment = require('moment-timezone');
const rp = require('request-promise');
const Excel = require('exceljs');
const { URL_API } = require('../configs/constants');
const { CODES_ERROR } = require('../configs/messages');

moment()
    .tz('Asia/Ho_Chi_Minh')
    .format();
// const PromotionTypes = ['Amount', 'Percent'];
module.exports = {
    deleteFile: (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    },
    getInfoUserSession: (req) => {
        const { user } = req.session.passport;
        console.log(req.session.passport.user);
        const Info = {
            Name: user.Info.FullName,
            RoleName: user.RoleName,
            Role: user.RoleCode,
            Language: user.Language,
            RoleObjectId: user.RoleObjectId,
            UserObjectId: user.UserObjectId,
        };
        return Info;
    },
    resourcesIsAccessed: (req) => {
        const { user } = req.session.passport;
        const resourcesIsAccessed = user.resourcesIsAccessed || [];
        const modules = new Set();
        const actions = new Set();
        const {length} = resourcesIsAccessed;

        for (let i = 0; i < length; i++) {
            const { Resources } = resourcesIsAccessed[i];
            modules.add(Resources.split('/')[2]);
            actions.add(Resources);
        }
        return {modules, actions};
    },
    getHeaders: (req) => {
        const { Token } = req.session.passport.user;
        return {
            'x-access-token': Token,
        };
    },
    isEmpty: value => empty(value),
    getDateYMDHMSCurrent: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    getYMDCurrent: () => moment().format('YYYY-MM-DD'),
    getDMYCurrent: () => moment().format('DD-MM-YYYY'),
    getDateDMYCurrent: () => moment().format('DD-MM-YYYY'),
    getDateDMYHMSCurrent: () => moment().format('DD-MM-YYYY HH:mm:ss'),
    makeDir: (filePath) => {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
    },
    responseError: (StatusCode, errors = {}) => {
        const response = {
            Success: false,
            StatusCode,
            Message: CODES_ERROR[StatusCode],
            Errors: errors,
        };
        return response;
    },
    checkResponseExpire: (req, res, result = {}) => {
        const { StatusCode } = result;
        if (StatusCode === 40013) {
            req.logout();
            res.redirect('/');
        }
        return result;
    },
    sendBodyToAPI: async (method, uri, headers, body, json = true) => {
        const options = {
            method,
            uri: `${URL_API}${uri}`,
            headers,
            body,
            json,
        };
        const result = await rp(options);
        return result;
    },
    sendQueryToAPI: async (method, uri, headers, qs, json = true) => {
        const options = {
            method,
            uri: `${URL_API}${uri}`,
            headers,
            qs,
            json,
        };
        const result = await rp(options);
        return result;
    },
    sendDataToClient: (req, res, result = {}) => {
        const { checkResponseExpire } = module.exports;
        checkResponseExpire(req, res, result);
        return res.json(result);
    },
    sendFormDataToAPI: async (method, uri, headers, formData, json = true) => {
        const options = {
            method,
            uri: `${URL_API}${uri}`,
            headers,
            formData,
            json,
        };
        const result = await rp(options);
        return result;
    },
    isFileImage: string => string.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/),
    fileFilterImage: (req, file, cb) => {
        const { isFileImage } = module.exports;
        if (!isFileImage(file.originalname)) {
            return cb({ StatusCode: 40016 });
        }
        return cb(null, true);
    },
    storage: (...foldersSaved) => {
        const { makeDir } = module.exports;
        return multer.diskStorage({
            destination: (req, file, cb) => {
                makeDir(path.join(__dirname, '../public/uploads/'));
                let dirUpload = '';
                let directoryForlder = '';
                foldersSaved.map((folder) => {
                    directoryForlder += `${folder}/`;
                    dirUpload = path.join(__dirname, `../public/uploads/${directoryForlder}`);
                    makeDir(dirUpload);
                });
                cb(null, dirUpload);
            },
            filename: (req, file, cb) => {
                const fileName = `${Date.now()}_${path.extname(file.originalname)}`;
                cb(null, fileName);
            },
        });
    },
    isFileExcel: string => string.match(/\.(xlsx|xls)$/),
    fileFilterExcel: (req, file, cb) => {
        const { isFileExcel } = module.exports;
        if (!isFileExcel(file.originalname)) {
            return cb({ StatusCode: 40017 });
        }
        return cb(null, true);
    },
    uploadFile: (storage, fileFilter, singleName) => multer({
        storage,
        fileFilter,
    }).single(singleName),
    uploadManyFile: (storage, fileFilter, Name) => multer({
        storage,
        fileFilter,
    }).array(Name),
    beforeUpload: (req, res, next, uploadFile) => {
        uploadFile(req, res, (err) => {
            const { isEmpty, deleteFile, responseError } = module.exports;
            if (!isEmpty(err)) {
                const { StatusCode } = err;
                return res.json(responseError(StatusCode || 40015));
            }
            if (req.file && req.file.size > 25411800) {
                deleteFile(req.file.path);
                return res.json(responseError(40000));
            }
            return next();
        });
    },
    sliceString: (string, strStart = '', strEnd = '') => {
        if (!strStart && !strEnd) {
            return '';
        }
        const start = string.search(strStart);
        const end = string.search(strEnd);
        if (strStart && strEnd && start > -1 && end > -1) {
            return string.slice(start, end);
        }
        if (strStart && start > -1) {
            return string.slice(start);
        }
        if (strEnd && end > -1) {
            return string.slice(0, end);
        }
        return '';
    },
    styleExcel: {
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        },
        fontHeader: {
            name: 'Times New Roman',
            size: 12,
            underline: false,
            bold: true,
        },
        fontBody: {
            name: 'Times New Roman',
            size: 12,
            underline: false,
        },
    },
    getColumnExcel: (columns = []) => {
        const { styleExcel } = module.exports;
        const columnsExcel = columns.map(col => ({
            header: col,
            width: 20,
            style: {
                font: styleExcel.fontHeader,
            },
        }));
        return columnsExcel;
    },
    newSheetExcel: (SheetName) => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(SheetName);
        return {workbook, worksheet};
    },
    async writeFileExcel(workbook, filePath) {
        await workbook.xlsx.writeFile(filePath, {
            cellStyles: true,
        });
    },
    trimValue: value => String(value).trim(),
    filterStatus: (status) => {
        const { trimValue } = module.exports;
        if (trimValue(status).toLowerCase() === 'active') {
            return 'Hoạt động';
        }
        if (trimValue(status).toLowerCase() === 'waitingaccepted') {
            return 'Mới';
        }
        if (trimValue(status).toLowerCase() === 'inactive') {
            return 'Ngừng';
        }
        return '';
    },
    filterStatusPatient: (status) => {
        const { trimValue } = module.exports;
        if (trimValue(status).toLowerCase() === 'inprocess') {
            return 'Đang khám';
        }
        if (trimValue(status).toLowerCase() === 'waitingaccepted') {
            return 'Mới';
        }
        if (trimValue(status).toLowerCase() === 'done') {
            return 'Đã khám';
        }
        return '';
    },
    fsCreateReadStream: (filePath) => {
        const { deleteFile } = module.exports;
        const stream = fs.createReadStream(filePath);
        stream.on('end', () => {
            deleteFile(filePath);
        });
        return stream;
    },
    joinPath: filePath => path.join(__dirname, filePath),
    sliceString: (string, strStart = '', strEnd = '') => {
        if (!strStart && !strEnd) { return ''; }
        const start = string.search(strStart);
        const end = string.search(strEnd);
        if (strStart && strEnd && start > -1 && end > -1) {
            return string.slice(start, end);
        }
        if (strStart && start > -1) {
            return string.slice(start);
        }
        if (strEnd && end > -1) {
            return string.slice(0, end);
        }
        return '';
    },
    removeCommaLast: (string = '') => {
        const { trimValue } = module.exports;
        const newstring = trimValue(string);
        if (newstring.slice(-1) !== ',') { return newstring; }
        const lastIdx = newstring.lastIndexOf(',');
        return newstring.substr(0, lastIdx);
    },
    convertStringToArray: (string = '') => {
        const { removeCommaLast } = module.exports;
        string = removeCommaLast(string);
        return string.split(/\s*,\s*/);
    },
    formatDateToDMY: (date, formatToDate = 'DD/MM/YYYY') => {
        const _isValidDayDMY = moment(date, 'DD/MM/YYYY', true).isValid();
        if (_isValidDayDMY) {
            return date;
        }
        const _isValidDayYMD = moment(date, 'YYYY-MM-DD', true).isValid();
        if (_isValidDayYMD) {
            const newDate = moment(date.toString(), 'YYYY-MM-DD').format(formatToDate);
            return newDate;
        }
        const _isValidDayYMDHms = moment(date, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD H:m:s'], true).isValid();
        if (_isValidDayYMDHms) {
            const newDate = moment(date.toString(), ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD H:m:s']).format(formatToDate);
            return newDate;
        }
        return '';
    },
    removeCommaLast: (string = '') => {
        const { trimValue } = module.exports;
        string = trimValue(string);
        if (string.slice(-1) !== ',') { return string; }
        const lastIdx = string.lastIndexOf(',');
        return string.substr(0, lastIdx);
    },
    convertArrayObjectToString: (array = [], fieldTaken1 = '', fieldTaken2 = '') => {
        const { removeCommaLast } = module.exports;
        const len = array.length;
        let str1 = '';
        let str2 = '';
        for (let i = 0; i < len; i++) {
            const item = array[i];
            str1 += `${item[fieldTaken1] || ''}, `;
            str2 += `${item[fieldTaken2] || ''}, `;
        }
        str1 = removeCommaLast(str1);
        str2 = removeCommaLast(str2);
        return {
            [fieldTaken1]: str1,
            [fieldTaken2]: str2,
        };
    },
    generatorTime: () => moment().format('YYYY-MM-DD HH:mm:ss'),
};
