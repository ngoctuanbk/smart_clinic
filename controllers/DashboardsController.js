const {
    getInfoUserSession,
    resourcesIsAccessed,
    responseError,
} = require('../libs/shared');

module.exports = {
    index: async (req, res) => {
        try {
            const Info = getInfoUserSession(req);
            // const isAllowed = true;
            const activity = 'Dashboard';
            // const _resources = resourcesIsAccessed(req);
            res.render('dashboards/index', {
                layout: 'dashboards',
                title: ':: SmartClinic website | All for a smart clinic  ::',
                // activity,
                Info,
                // isAllowed,
                // _resources,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(responseError(1001, error));
        }
    },
};
