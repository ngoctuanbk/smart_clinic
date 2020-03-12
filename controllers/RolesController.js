const {
    getHeaders,
    responseError,
    sendQueryToAPI,
    sendDataToClient,
} = require('../libs/shared');

module.exports = {
    listActive: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/roles/listActive', getHeaders(req), req.query, true);
            sendDataToClient(req, res, result);
        } catch (err) {
            res.status(500).json(responseError(1001, err));
        }
    },
};
