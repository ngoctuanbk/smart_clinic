const {
    getInfoUserSession,
    responseError,
    sendDataToClient,
    sendFormDataToAPI,
    getHeaders,
    isEmpty,
    beforeUpload,
    fileFilterImage,
    fsCreateReadStream,
    storage,
    uploadFile,
    sendQueryToAPI,
    // joinPath,
    // convertArrayObjectToString,
    // formatDateToDMY,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');
const uploadImage = uploadFile(storage('users', 'images'), fileFilterImage, 'File');
const { response404, response403 } = require('../libs/httpResponse');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        res.render('users/index', {
            layout: 'users',
            title: TITLE_ADMIN,
            activity: 'Users',
            Info,
        });
    },
    add: async (req, res) => {
        const Info = getInfoUserSession(req);
        return res.render('users/add', {
            layout: 'user_add',
            title: TITLE_ADMIN,
            activity: 'Users',
            Info,
        });
    },
    create: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                const formData = {};
                for (const prop in req.body) {
                    if (!isEmpty(req.body[prop])) {
                        formData[prop] = req.body[prop];
                    }
                }
                if (!isEmpty(req.file)) {
                    const stream = fsCreateReadStream(req.file.path);
                    formData.Image = stream;
                }
                const result = await sendFormDataToAPI('POST', 'api/users/create', getHeaders(req), formData, true);
                sendDataToClient(req, res, result);
            }, uploadImage);
        } catch (err) {
            res.status(500).json(responseError(1001, err));
        }
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/users/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
};
