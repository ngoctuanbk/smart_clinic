const {
    getHeaders,
    responseError,
    sendQueryToAPI,
    sendBodyToAPI,
    sendDataToClient,
    getInfoUserSession,
    sendFormDataToAPI,
    beforeUpload,
    fsCreateReadStream,
    uploadManyFile,
    storage,
    fileFilterImage,
    isEmpty,
} = require('../libs/shared');
const uploadImage = (...forlderSaved) => uploadManyFile(storage(...forlderSaved), fileFilterImage, 'File');

const { TITLE_ADMIN } = require('../configs/constants');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        return res.render('images/index', {
            layout: 'images',
            title: TITLE_ADMIN,
            activity: 'Images',
            Info,
        });
    },
    create: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/images/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/images/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listByPatient: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/images/listByPatient', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    update: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                const formData = {};
                // eslint-disable-next-line guard-for-in
                for (const i in req.body) {
                    formData[i] = req.body[i];
                }
                formData.Images = [];
                if (!isEmpty(req.files)) {
                    req.files.map((item) => {
                        const stream = fsCreateReadStream(item.path);
                        formData.Images.push(stream);
                    });
                }
                const result = await sendFormDataToAPI('PUT', 'api/images/update', getHeaders(req), formData, true);
                sendDataToClient(req, res, result);
            }, uploadImage('images', 'image'));
        } catch (err) {
            res.status(500).json(responseError(1001));
        }
    },
    updateStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/images/updateStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
};
