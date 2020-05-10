const ActivitiesController = require('../../controllers/ActivitiesController');

function ActivitiesRoute(apiRouter) {
    apiRouter.route('/activities/list').get(ActivitiesController.list);
}

module.exports = ActivitiesRoute;
