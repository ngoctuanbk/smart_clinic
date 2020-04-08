const {
    getInfoUserSession,
    responseError,
    sendQueryToAPI,
    getHeaders,
    sendDataToClient,
    sendBodyToAPI,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');

module.exports = {
    index: async (req, res) => {
        try {
            const Info = getInfoUserSession(req);
            return res.render('schedules/index', {
                layout: 'schedules',
                title: TITLE_ADMIN,
                activity: 'Schedules',
                Info,
            });
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/schedules/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    create: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/schedules/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    info: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/schedules/info', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/schedules/updateStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
};
