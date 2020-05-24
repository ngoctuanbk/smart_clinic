
const util = require('util');
const winston = require('winston');
const mongoose = require('mongoose');
const fs = require('fs');
const empty = require('is-empty');
const Promise = require('bluebird');
const destroy = require('destroy');
const moment = require('moment-timezone');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const bcrypt = require('bcrypt');
const { CODES_SUCCESS, CODES_ERROR} = require('../constants/messages');
const { STATUS, ROLE } = require('../constants/constants');

moment()
    .tz('Asia/Ho_Chi_Minh')
    .format();
const options = {
    useNewUrlParser: true,
    autoIndex: true, // Don't build indexes
    // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    // poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    //  bufferMaxEntries: 0,
    // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    // family: 4 // Use IPv4, skip trying IPv6
};

const optionsRandom = {
    length: 6,
    charset: 'numeric',
};
const timeFormat = 'HH:mm';
function logConfiguration(fileName = 'logError') {
    return {
        transports: [
            new winston.transports.File({ filename: path.join(__dirname, `../logs/${fileName}.log`) }),
        ],
    };
}

function writeLog(fileName, error) {
    const logger = winston.createLogger(logConfiguration(fileName));
    logger.error(error);
}
module.exports = {
    connDB: async (database) => {
        try {
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useFindAndModify', false);
            mongoose.set('useCreateIndex', true);
            const conn = await mongoose.createConnection(
                `mongodb://${database.User}:${database.Password}@${database.Host}:${
                    database.Host
                }/${database.Name}`,
                options,
            );
            console.log(`connected to ${database.Name} database!`);
            return Promise.resolve(conn);
        } catch (err) {
            return Promise.reject(err);
        }
    },
    connectDatabase: (Database) => {
        // eslint-disable-next-line global-require
        const { database } = require('../configs/database');
        const { findArrayByKey } = module.exports;
        const conn = findArrayByKey(database, Database.Name)[Database.Name];
        return conn;
    },
    logConfiguration: (fileName = 'logError.log') => ({
        transports: [
            new winston.transports.File({ filename: path.join(__dirname, `../logs/${fileName}`) }),
        ],
    }),
    isObject: a => !!a && a.constructor === Object && !!Object.keys(a).length,
    isArray: a => Array.isArray(a),
    isObjectId: a => mongoose.Types.ObjectId.isValid(a) && typeof a !== 'number',
    isNullObjectId: value => (value && value !== '' ? mongoose.Types.ObjectId.isValid(value) && typeof values !== 'number' : true),
    isArrayObjectId: (values = []) => {
        const { isObjectId } = module.exports;
        const len = values.length;
        let isValid = true;
        for (let i = 0; i < len; i++) {
            if (!isObjectId(values[i])) {
                isValid = false;
                break;
            }
        }
        return isValid;
    },
    convertStringToUTF8: (string = '') => {
        // eslint-disable-next-line no-buffer-constructor
        const buffer = new Buffer(string, 'utf-8');
        const base64data = buffer.toString('utf-8');
        return base64data;
    },
    deleteFile: (filePath) => {
        if (fs.existsSync(filePath)) {
            const stream = fs.unlinkSync(filePath);
            destroy(stream);
        }
    },
    getTimeCurrent: (typeFormat = 'HH:mm') => moment().format(typeFormat),
    getDateCurrent: () => moment().format('YYYY-MM-DD'),
    generatorTime: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    generatorHoursMinutes: () => moment().format('HH:mm'),
    getMonth: date => moment(date, 'MM-YYYY').format('M'),
    getYears: date => moment(date, 'MM-YYYY').format('YYYY'),
    convertToObjectId: value => mongoose.Types.ObjectId(value),
    isEmpty: value => empty(value),
    isArrayEmpty: (array) => {
        if (array && array.length) {
            return true;
        }
        return false;
    },
    uniqArray: value => Array.from(new Set(value)),
    findArrayByKey: (array, key) => array.find(o => Object.prototype.hasOwnProperty.call(o, key)),
    hasProperty: (obj, value) => Object.prototype.hasOwnProperty.call(obj, value),
    inArray: (array, value) => array.indexOf(value) > -1,

    isNumberInteger: value => Number.isInteger(+value),
    isNumber: value => Number(value) === +value,
    isEmail: (value) => {
        // eslint-disable-next-line no-useless-escape
        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return !!filter.test(value);
    },
    isMobilePhone: (value) => {
        const self = module.exports;
        if (!self.isNumber(value) || !self.isNumberInteger(+value)) { return false; }
        value = String(value).replace('+', '');
        if (value.length < 9 || value.length > 13) { return false; }
        const fistNumber = value.substr(0, 2);
        const isMobile = /84|01|02|03|04|05|06|07|08|09/i;
        const checkTwoFirstNumber = isMobile.test(fistNumber);
        return checkTwoFirstNumber;
    },
    isPassport: (value) => {
        const regex = /([0-9])\b/;
        if (regex.test(value)) {
            return (String(value).length >= 9 && String(value).length <= 12);
        }
        return false;
    },
    notSpaceAllow: value => /^\S*$/.test(value),
    makeDir: (filePath) => {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
    },
    responseSuccess: (statusCode, result = {}) => {
        const response = {
            Success: true,
            StatusCode: statusCode,
            Message: CODES_SUCCESS[statusCode],
        };
        if (result) {
            response.Data = result;
        }
        return response;
    },
    responseError: (statusCode, errors = {}) => {
        const response = {
            Success: false,
            StatusCode: statusCode,
            Message: CODES_ERROR[statusCode],
        };
        if (!empty(errors)) {
            response.Errors = errors;
        }
        return response;
    },
    resJsonError: (res, error, filename) => {
        const { responseError, generatorTime } = module.exports;
        const msg = `${generatorTime()}: ${JSON.stringify(error)}`;
        writeLog(filename, msg);
        return res.json(responseError(100001, error));
    },
    compareValue: (val1, val2) => {
        if (!val1 && !val2) return true;
        return !!(val1 && val2 && String(val1) === String(val2));
    },
    convertToArrayObjectId(ObjectIds) {
        let newArrayObjectId;
        if (Array.isArray(ObjectIds)) {
            newArrayObjectId = ObjectIds.map(ObjectId => mongoose.Types.ObjectId(ObjectId));
        } else {
            newArrayObjectId = ObjectIds.split(',').map(ObjectId => mongoose.Types.ObjectId(ObjectId));
        }
        return newArrayObjectId;
    },
    // convertToArrayString(ObjectIds) {
    //     let newArrayObjectId;
    //     if (Array.isArray(ObjectIds)) {
    //         newArrayObjectId = ObjectIds.map(ObjectId => ObjectId.toString());
    //     } else {
    //         newArrayObjectId = ObjectIds.split(',').map(ObjectId => ObjectId.toString());
    //     }
    //     return newArrayObjectId;
    // },
    // convertStrToArr: (value = '', charSplit = ',') => {
    //     if (Array.isArray(value)) {
    //         return value;
    //     }
    //     const arr = value.split(charSplit);
    //     return arr;
    // },
    // isStatusActive: status => status === STATUS[200],
    escapeRegExp: (string = '') => String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    isFileImage: string => string.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/),
    fileFilterImage: (req, file, cb) => {
        const { isFileImage } = module.exports;
        if (!isFileImage(file.originalname)) {
            return cb({ StatusCode: 40016});
        }
        return cb(null, true);
    },
    storage: (...foldersSaved) => {
        const {makeDir} = module.exports;
        return multer.diskStorage({
            destination: (req, file, cb) => {
                makeDir(path.join(__dirname, '../public/uploads/'));
                let dirUpload = '';
                let directoryForlder = '';
                // eslint-disable-next-line array-callback-return
                foldersSaved.map((folder) => {
                    directoryForlder += `${folder}/`;
                    dirUpload = path.join(__dirname, `../public/uploads/${directoryForlder}`);
                    makeDir(dirUpload);
                });
                cb(null, dirUpload);
            },
            filename: (req, file, cb) => {
                const fileName = Date.now() + path.extname(file.originalname);
                cb(null, fileName);
            },
        });
    },
    uploadFile: (storage, fileFilter, singleName) => multer({
        storage,
        fileFilter,
    }).single(singleName),
    uploadManyFile: (storage, fileFilter, Name) => multer({
        storage,
        fileFilter,
    }).array(Name),
    isFileExcel: string => string.match(/\.(xlsx|xls)$/),
    fileFilterExcel: (req, file, cb) => {
        const { isFileExcel } = module.exports;
        if (!isFileExcel(file.originalname)) {
            return cb({ StatusCode: 40017});
        }
        return cb(null, true);
    },
    beforeUpload: (req, res, next, uploadFile) => {
        uploadFile(req, res, (err) => {
            const { isEmpty, deleteFile, responseError } = module.exports;
            if (!isEmpty(err)) {
                console.log(err);
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
    trimValue: value => String(value || '').trim(),
    filterStatus: (status = '') => {
        const { trimValue } = module.exports;
        if (trimValue(status).toLowerCase() === 'hoạt động') {
            return 'Active';
        }
        if (trimValue(status).toLowerCase() === 'mới') {
            return 'WaitingAccepted';
        }
        if (trimValue(status).toLowerCase() === 'ngừng'
                || trimValue(status).toLowerCase() === 'ngưng'
                || trimValue(status).toLowerCase() === 'hủy') {
            return 'Inactive';
        }
        return '';
    },
    deduplicateArray: (array) => {
        const set = new Set(array);
        const it = set.values();
        return Array.from(it);
    },
    padNumber: (number) => {
        const lenNumber = String(number).length;
        return lenNumber < 6 ? (new Array(7 - lenNumber).join('0') + number) : number;
    },
    readFileExcel: (filePath, options = {}) => {
        const workbook = xlsx.readFile(filePath);
        const sheetsName = workbook.SheetNames;
        const firstSheetName = sheetsName[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const obj = {
            worksheet: '',
            data: [],
        };
        if (!empty(worksheet)) {
            obj.worksheet = worksheet;
            const _options = {
                raw: false,
            };
            if (options.header) {
                _options.header = options.header;
            }
            obj.data = xlsx.utils.sheet_to_json(worksheet, _options);
        }
        return obj;
    },
    // removeAccents: str => String(str).normalize('NFD')
    //     .replace(/[\u0300-\u036f]/g, '')
    //     .replace(/đ/g, 'd')
    //     .replace(/Đ/g, 'D'),
    strDateTimeFormat: [
        'DD-MM-YYYY',
        'DD-M-YYYY',
        'D-M-YYYY',
        'MM-DD-YYYY',
        'YYYY-MM-DD',
        'YYYY-M-D',
        'YYYY-DD-MM',
        'MM-YYYY-DD',
        'DD-YYYY-MM',
        'DD.MM.YYYY',
        'MM.DD.YYYY',
        'YYYY.MM.DD',
        'YYYY.DD.MM',
        'DD.YYYY.MM',
        'MM.YYYY.DD',
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'YYYY/MM/DD',
        'YYYY/DD/MM',
        'MM/YYYY/DD',
        'DD/YYYY/MM',
        'YYYY-MM-DD HH:mm:ss',
        'DD-MM-YYYY HH:mm:ss',
        'DD/MM/YYYY HH:mm:ss',
        'D/M/YY',
        'MM/YYYY',
        'MM/YY',
        'MM-YY',
        'MM-YYYY',
        'YYYY-MM',
        'YYYY-M',
    ],
    isValidDate: (date) => {
        const { strDateTimeFormat } = module.exports;
        const isValidDate = moment(date, strDateTimeFormat, true).isValid();
        return isValidDate;
    },
    strMonthTimeFormat: [
        'YYYY-MM',
        'YYYY-M',
        'MM/YYYY',
        'MM/YY',
        'MM-YY',
        'MM-YYYY',
    ],
    isValidMonth: (month) => {
        const { strMonthTimeFormat } = module.exports;
        const isValidDate = moment(month, strMonthTimeFormat, true).isValid();
        return isValidDate;
    },
    isValidYear: (year) => {
        const isValidYear = moment(year, 'YYYY', true).isValid();
        return isValidYear;
    },
    TimeFormat: ['HH:mm', 'H:m'],
    isValidTime: (time) => {
        const { TimeFormat } = module.exports;
        const isValidTime = moment(time, TimeFormat, true).isValid();
        return isValidTime;
    },
    MonthFormat: ['YYYY-MM'],
    isValidMonthYear: (month) => {
        const { MonthFormat } = module.exports;
        const isValidMonthYear = moment(month, MonthFormat, true).isValid();
        return isValidMonthYear;
    },
    DayFormat: ['YYYY-MM-DD'],
    isValidDay: (month) => {
        const { DayFormat } = module.exports;
        const isValidDay = moment(month, DayFormat, true).isValid();
        return isValidDay;
    },
    formatDateTo: (date, typeFormat = 'YYYY-MM-DD') => {
        const { strDateTimeFormat } = module.exports;
        const _isValidDayYMDHms = moment(date, strDateTimeFormat, true).isValid();
        if (_isValidDayYMDHms) {
            const newDate = moment(date.toString(), strDateTimeFormat).format(typeFormat);
            return newDate;
        }
        return '';
    },
    formatDateToYMD: (date) => {
        const { strDateTimeFormat } = module.exports;
        const _isValidDayYMDHms = moment(date, strDateTimeFormat, true).isValid();
        if (_isValidDayYMDHms) {
            const newDate = moment(date.toString(), strDateTimeFormat).format('YYYY-MM-DD');
            return newDate;
        }
        return '';
    },
    formatDateToMY: (date, formatType = 'MM-YYYY') => {
        const { strDateTimeFormat, strMonthTimeFormat } = module.exports;
        const formatMonths = [...strDateTimeFormat, ...strMonthTimeFormat];
        const _isValidMY = moment(date, formatMonths, true).isValid();
        if (_isValidMY) {
            const newDate = moment(date.toString(), formatMonths).format(formatType);
            return newDate;
        }
        return '';
    },
    getYear: async (date) => {
        const {strDateTimeFormat} = module.exports;
        const _isValidMY = moment(date, strDateTimeFormat, true).isValid();
        if (_isValidMY) {
            const newDate = moment(date, strDateTimeFormat).format('YYYY');
            return newDate;
        }
        return '';
    },
    formatTimeToHHmm: (time) => {
        const { isValidTime, TimeFormat } = module.exports;
        if (isValidTime(time)) {
            const newDate = moment(time, TimeFormat).format('HH:mm');
            return newDate;
        }
        return '';
    },
    formatDateToYM: (date) => {
        const { strDateTimeFormat } = module.exports;
        const _isValidDate = moment(date, strDateTimeFormat, true).isValid();
        if (_isValidDate) {
            const newDate = moment(date, strDateTimeFormat).format('YYYY-MM');
            return newDate;
        }
        return '';
    },
    getYMCurrent: moment().format('YYYY-MM'),
    convertToTime: (time, str) => {
        if (time) {
            let obj;
            const { strDateTimeFormat } = module.exports;
            const isValidDate = moment(time, strDateTimeFormat, true).isValid();
            if (isValidDate) {
                if (str === 'from') {
                    obj = moment(time, strDateTimeFormat, true).format('YYYY-MM-DD 00:00:00');
                }
                if (str === 'to') {
                    obj = moment(time, strDateTimeFormat, true).format('YYYY-MM-DD 23:59:59');
                }
                return obj.toString();
            }
            return false;
        }
    },
    nextDay: (number = 0, formatDate = 'YYYY-MM-DD') => {
        const { getDateYMDCurrent } = module.exports;
        return moment(getDateYMDCurrent()).add(number, 'days').format(formatDate);
    },
    preDay: (number = 0, formatDate = 'YYYY-MM-DD') => {
        const { getDateYMDCurrent } = module.exports;
        return moment(getDateYMDCurrent()).subtract(number, 'days').format(formatDate);
    },
    preMonth: (number = 0, formatDate = 'YYYY-MM-DD', position = 'firstDay') => {
        // position value in  [firstDay, today, endDay];
        const { getTimeCurrent, endDayOfMonth, formatDateTo} = module.exports;
        let month = +(getTimeCurrent('MM'));
        let year = +(getTimeCurrent('YYYY'));
        const day = getTimeCurrent('DD');
        for (let i = number; i >= 1; i--) {
            month -= 1;
            if (month === 0) {
                month = 12;
                year -= 1;
            }
        }

        if (position === 'firstDay') {
            const date = `${year}-${month}-01`;
            return formatDateTo(date, formatDate);
        }
        if (position === 'today') {
            const date = `${year}-${month}-${day}`;
            return formatDateTo(date, formatDate);
        }
        if (position === 'endDay') {
            const date = `${year}-${month}-01`;
            return endDayOfMonth(date, formatDate);
        }
    },
    firstDayOfMonth: (date, dateFormat = 'YYYY-MM-DD HH:mm:ss') => moment(date)
        .startOf('month')
        .format(dateFormat),
    endDayOfMonth: (date, dateFormat = 'YYYY-MM-DD HH:mm:ss') => moment(date)
        .endOf('month')
        .format(dateFormat),
    TimeUnix: (date, typeDateFormat = 'YYYY-MM-DD') => moment(date, typeDateFormat).unix(),
    TimeUnixToTime: (value, typeFormat = 'YYYY-MM-DD') => moment.unix(value).format(typeFormat),
    getDateYMDCurrent: () => moment().format('YYYY-MM-DD'),
    getYearCurrent: moment().format('YYYY'),
    getMonthCurrent: moment().format('MM'),
    totalDaysInMonth: (year, month) => {
        year = year || (new Date()).getFullYear();
        month = month || (new Date()).getMonth() + 1;
        return new Date(year, month, 0).getDate();
    },
    getParamsWriteLog: (LogName, Model, Data, Action, Decoded, RefObjectId = null) => ({
        LogName,
        Model,
        Data: JSON.stringify(Data),
        Action,
        RefObjectId,
        Users: {
            UserName: Decoded.UserName,
            // FullName: Decoded.Info.FullName || '',
            UserObjectId: Decoded.UserObjectId,
        },
        Database: Decoded.Database,
        CreatedBy: Decoded.UserObjectId,
    }),
    // filterOnly: (role) => {
    //     if (role === ROLE.SaleRep) {
    //         return true;
    //     } if (role === ROLE.PG) {
    //         return true;
    //     } if (role === ROLE.Member) {
    //         return true;
    //     }
    // },
    // hashPassword: Password => bcrypt.hashSync(Password.toString(), bcrypt.genSaltSync(8), null),
    promiseResolve: data => Promise.resolve(data),
    promiseReject: err => Promise.reject(err),
    // isRolePGLeaderOrASM: role => [ROLE.ASM, ROLE.PGLeader].includes(role),
    // isRolePGLeader: role => role === ROLE.PGLeader,
    // isRoleASM: role => role === ROLE.ASM,
    // isRoleSaleReOrPG: role => [ROLE.SaleRep, ROLE.PG].includes(role),
    // isRoleSaleRep: role => role === ROLE.SaleRep,
    // isRolePG: role => role === ROLE.PG,
    // isRoleDirector: role => role === ROLE.Director,
    // isRoleBackOffice: role => role === ROLE.BackOffice,
    // isRoleAdTeRsmMe: role => [ROLE.AdminSystem, ROLE.TechnicalSupport, ROLE.RSM, ROLE.Member].includes(role),
    // isRoleAdmin: role => role === ROLE.AdminSystem,
    removeCommaLast: (string = '') => {
        const { trimValue } = module.exports;
        string = trimValue(string);
        if (string.slice(-1) !== ',') { return string; }
        const lastIdx = string.lastIndexOf(',');
        return string.substr(0, lastIdx);
    },
    convertStringToArray: (string = '') => {
        const { removeCommaLast } = module.exports;
        string = removeCommaLast(string);
        return string.split(/\s*,\s*/);
    },
    // hasDuplicateInArrays: (array1 = [], array2 = []) => {
    //     if (typeof array2 === 'string') {
    //         array2 = array2.split(',');
    //     }
    //     const len2 = array2.length;
    //     let isEqual = false;
    //     for (let i = 0; i < len2; i++) {
    //         if (!array1.includes(array2[i])) {
    //             isEqual = true;
    //             break;
    //         }
    //     }
    //     return isEqual;
    // },
    isJSON: (value) => {
        try {
            JSON.parse(value);
        } catch (e) {
            return false;
        }
        return true;
    },
    // getNestedValue(obj, key) {
    //     return key.split('.').reduce((result, key) => result[key], obj);
    // },
    // sortByProps: (props, reverse = false) => {
    //     const { getNestedValue } = module.exports;
    //     reverse = !reverse ? 1 : -1;
    //     return (a, b) => {
    //         a = getNestedValue(a, props);
    //         b = getNestedValue(b, props);
    //         // eslint-disable-next-line no-nested-ternary
    //         return a > b ? reverse * 1 : b > a ? reverse * -1 : 0;
    //     };
    // },
    // validateObjectIds: (field, required = false) => {
    //     const { isArrayObjectId, isEmpty, isObjectId } = module.exports;
    //     const obj = {
    //         [field]: {
    //             [required ? 'notEmpty' : 'optional']: true,
    //             custom: {
    //                 options: value => isArrayObjectId(value),
    //                 errorMessage: `${field} must be an array ObjectId`,
    //             },
    //         },
    //         [`${field}.*`]: {
    //             notEmpty: true,
    //             custom: {
    //                 options: value => !isEmpty(value) && isObjectId(value),
    //                 errorMessage: 'Value is required and Value must be an ObjectId',
    //             },
    //         },
    //     };
    //     return obj;
    // },
    // validateObjectId: (field, required = false) => {
    //     const { isObjectId } = module.exports;
    //     return {
    //         [field]: {
    //             [required ? 'notEmpty' : 'optional']: true,
    //             custom: {
    //                 options: value => isObjectId(value) || (value == null),
    //                 errorMessage: `${field} must is ObjectId or Null`,
    //             },
    //             errorMessage: `${field} is required`,
    //         },
    //     };
    // },
    RegExpSearch: (string = '') => {
        const { escapeRegExp } = module.exports;
        const regex = new RegExp(escapeRegExp(string), 'i');
        return regex;
    },
    // isValidLat: (lat) => {
    //     const regex = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    //     const validLat = regex.test(lat);
    //     if (validLat) {
    //         return true;
    //     }
    //     return false;
    // },
    // isValidLong: (long) => {
    //     const regex = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    //     const validLong = regex.test(long);
    //     if (validLong) {
    //         return true;
    //     }
    //     return false;
    // },
    // isScheduleShifts: value => value === 'Shifts',
    // isScheduleRoutes: value => value === 'Routes',
    // isResellerTypeBranchAgency: value => value === 'BranchAgency',
    // isResellerTypeReseller: value => value === 'Reseller',
    // intersect: (a, b) => a.filter(Set.prototype.has, new Set(b)),
    // isManagerTypeBoth: managerType => managerType === 'Both',
    // isManagerTypeDirect: managerType => managerType === 'Direct',
    // isManagerTypeInDirect: managerType => managerType === 'InDirect',
    // isBetweenNotEqual: (startTime, endTime, startTime2, endTime2) => {
    //     /** kiểm tra time năm trong khoảng thời gian */
    //     const resTimeStart = moment(startTime, timeFormat);
    //     const resTimeEnd = moment(endTime, timeFormat);
    //     const inTimeStart = moment(startTime2, timeFormat);
    //     const inTimeEnd = moment(endTime2, timeFormat);
    //     if ((resTimeStart.toString() === inTimeStart.toString())
    //         || (resTimeEnd.toString() === inTimeEnd.toString())
    //         || resTimeStart.isBetween(inTimeStart, inTimeEnd)
    //         || resTimeEnd.isBetween(inTimeStart, inTimeEnd)) {
    //         return false;
    //     } if ((resTimeStart.toString() === inTimeStart.toString())
    //         || (resTimeEnd.toString() === inTimeEnd.toString())
    //         || inTimeStart.isBetween(resTimeStart, resTimeEnd)
    //         || inTimeEnd.isBetween(resTimeStart, resTimeEnd)) {
    //         return false;
    //     }
    //     return true;
    // },
    // convertNumber: number => (String(number).length === 1 ? `0${number}` : number),
    // capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),
    convertJSONStrToJSONParse: (obj = {}) => {
        const {isJSON } = module.exports;
        for (const key in obj) {
            if (isJSON(obj[key])) {
                obj[key] = JSON.parse(obj[key]);
            }
        }
        return obj;
    },
    // filterElementObjectArray: (array, field, value) => array.filter((e) => {
    //     if (e[field].toString() === value.toString()) {
    //         return true;
    //     }
    //     return false;
    // }),
    // betweenDate: (startDate, stopDate) => {
    //     const dateArray = [];
    //     let currentDate = moment(startDate);
    //     const endDate = moment(stopDate);
    //     while (currentDate <= endDate) {
    //         dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    //         currentDate = moment(currentDate).add(1, 'days');
    //     }
    //     return dateArray;
    // },
    // convertResultAggregatePagination: (result, page = 1, limit = 10) => {
    //     const { isEmpty } = module.exports;
    //     if (!isEmpty(result)) {
    //         const _pagination = !isEmpty(result) ? (result[0].pagination[0] || {
    //             page, limit, total: 0,
    //         })
    //             : {
    //                 page, limit, total: 0,
    //             };
    //         _pagination.pages = Math.ceil(_pagination.total / limit);
    //         const response = {
    //             ..._pagination,
    //             docs: result[0].docs,
    //         };
    //         return response;
    //     }
    //     const response = {
    //         page,
    //         limit,
    //         total: 0,
    //         pages: 0,
    //         docs: [],
    //     };
    //     return response;
    // },
    lookupAggre: (from, localField, foreignField, as) => ({
        from, localField, foreignField, as,
    }),
    unwindAggre: (path, preserveNullAndEmptyArrays = true) => ({
        path, preserveNullAndEmptyArrays,
    }),
};
