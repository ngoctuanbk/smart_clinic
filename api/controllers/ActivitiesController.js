
const ActivitiesService = require('../services/ActivitiesService');

const {
    responseSuccess,
    resJsonError,
} = require('../libs/shared');

module.exports = {
    list: async (req, res) => {
        try {
            const result = await ActivitiesService.list(req.query);
            return res.json(responseSuccess(10163, result));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'activities');
        }
    }
};
