const {
    getInfoUserSession,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        return res.render('labs_result/index', {
            layout: 'labs_result',
            title: TITLE_ADMIN,
            activity: 'LabResults',
            Info,
        });
    }
};
