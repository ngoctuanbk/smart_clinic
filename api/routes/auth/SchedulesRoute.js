const SchedulesController = require('../../controllers/SchedulesController');

function SchedulesRoute(apiRouter) {
    apiRouter.route('/schedules/create').post(SchedulesController.create);
    apiRouter.route('/schedules/list').get(SchedulesController.list);
}

module.exports = SchedulesRoute;
