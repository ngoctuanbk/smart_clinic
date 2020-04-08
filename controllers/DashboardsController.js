const {
    getInfoUserSession,
    responseError,
} = require('../libs/shared');

module.exports = {
    index: async (req, res) => {
        try {
            const Info = getInfoUserSession(req);
            res.render('dashboards/index', {
                layout: 'dashboards',
                title: ':: SmartClinic website | All for a smart clinic  ::',
                activity: 'Dashboard',
                Info,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(responseError(1001, error));
        }
    },
};
