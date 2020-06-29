const {
    getHeaders,
    responseError,
    sendQueryToAPI,
    sendBodyToAPI,
    sendDataToClient,
    getInfoUserSession,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        return res.render('medicines/index', {
            layout: 'medicines',
            title: TITLE_ADMIN,
            activity: 'Medicines',
            Info,
        });
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/medicines/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listActive: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/medicines/listActive', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    create: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/medicines/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    update: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/medicines/update', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/medicines/updateStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    delete: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/medicines/delete', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    // listActivity: async (req, res) => {
    //     try {
    //         const result = await sendQueryToAPI('GET', 'api/activities/list', getHeaders(req), req.query, true);
    //         return sendDataToClient(req, res, result);
    //     } catch (err) {
    //         return res.status(500).json(responseError(1001, err));
    //     }
    // },
};
