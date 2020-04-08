const SchedulesController = require('../../controllers/SchedulesController');

function SchedulesRoute(apiRouter) {
    apiRouter.route('/schedules/create').post(SchedulesController.create);
    apiRouter.route('/schedules/list').get(SchedulesController.list);
    apiRouter.route('/schedules/info').get(SchedulesController.info);
    apiRouter.route('/schedules/updateStatus').put(SchedulesController.updateStatus);
}

module.exports = SchedulesRoute;
