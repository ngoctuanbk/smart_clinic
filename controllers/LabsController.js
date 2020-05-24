const {
    getHeaders,
    responseError,
    sendQueryToAPI,
    sendBodyToAPI,
    sendDataToClient,
    getInfoUserSession,
    uploadFile,
    storage,
    fileFilterExcel,
    beforeUpload,
    sendFormDataToAPI,
    isEmpty,
    fsCreateReadStream,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');
const uploadExcel = uploadFile(storage('labs', 'excels'), fileFilterExcel, 'File');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        return res.render('labs/index', {
            layout: 'labs',
            title: TITLE_ADMIN,
            activity: 'Labs',
            Info,
        });
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/labs/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listByPatient: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/labs/listByPatient', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    create: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/labs/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    update: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/labs/update', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listActivity: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/activities/listByPatient', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    importFile: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                const formData = {};
                formData.LabDetailObjectId = req.body.LabDetailObjectId;
                if (!isEmpty(req.file)) {
                    const stream = fsCreateReadStream(req.file.path);
                    formData.FileExcel = stream;
                }
                const result = await sendFormDataToAPI('POST', 'api/lab_details/importFile', getHeaders(req), formData, true);
                if (result.Success) {
                    return sendDataToClient(req, res, result);
                }
                return sendDataToClient(req, res, result);
            }, uploadExcel);
        } catch (err) {
            console.log(err)
            res.status(500).json(responseError(1001));
        }
    },
    info: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/lab_details/info', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/labs/updateStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
};
