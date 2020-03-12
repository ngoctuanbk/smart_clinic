const {
    getInfoUserSession,
    getHeaders,
    responseError,
    sendBodyToAPI,
    sendQueryToAPI,
    sendDataToClient,
    newSheetExcel,
    deleteFile,
    getColumnExcel,
    styleExcel,
    getDMYCurrent,
    writeFileExcel,
    uploadFile,
    storage,
    fileFilterExcel,
    beforeUpload,
    isEmpty,
    fsCreateReadStream,
    joinPath,
    sendFormDataToAPI,
    resourcesIsAccessed,
    getTranslatesLanguage,
    getLanguagesHeader,
    getLanguageCurrent,
} = require('../libs/shared');
const { response403 } = require('../libs/httpResponse');
const { TITLE_ADMIN } = require('../configs/constants');

module.exports = {
    index: async (req, res) => { // eslint-disable-line
        try {
            const Info = getInfoUserSession(req);
            const activity = 'Provinces';
            return res.render('provinces/index', {
                layout: 'provinces',
                title: TITLE_ADMIN,
                activity,
                Info,
            });
        } catch (err) {
            return res.status(500).json(responseError(1001));
        }
    },
    listActive: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/provinces/listActive', getHeaders(req), req.query, true);
            sendDataToClient(req, res, result);
        } catch (err) {
            res.status(500).json(responseError(1001));
        }
    },
    listByProvince: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/districts/listActiveByProvince', getHeaders(req), req.query, true);
            sendDataToClient(req, res, result);
        } catch (err) {
            res.status(500).json(responseError(1001));
        }
    },
    listByDistrict: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/wards/listActiveByDistrict', getHeaders(req), req.query, true);
            sendDataToClient(req, res, result);
        } catch (err) {
            res.status(500).json(responseError(1001));
        }
    },
};
