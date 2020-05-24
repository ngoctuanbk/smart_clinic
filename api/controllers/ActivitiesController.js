
const ActivitiesService = require('../services/ActivitiesService');

const {
    responseSuccess,
    resJsonError,
} = require('../libs/shared');

module.exports = {
    listByPatient: async (req, res) => {
        try {
            const result = await ActivitiesService.listByPatient(req.query);
            return res.json(responseSuccess(10163, result));
        } catch (errors) {
            return resJsonError(res, errors, 'activities');
        }
    },
};
