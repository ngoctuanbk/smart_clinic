const ActivitiesController = require('../../controllers/ActivitiesController');

function ActivitiesRoute(apiRouter) {
    apiRouter.route('/activities/listByPatient').get(ActivitiesController.listByPatient);
}

module.exports = ActivitiesRoute;
