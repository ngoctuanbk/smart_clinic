const SchedulesController = require('../../controllers/SchedulesController');

// eslint-disable-next-line func-names
function SchedulesRoute(authRouter) {
    authRouter.route('/schedules').get(SchedulesController.index);
    authRouter.route('/schedules/list').get(SchedulesController.list);
    authRouter.route('/schedules/create').post(SchedulesController.create);
    authRouter.route('/schedules/info').get(SchedulesController.info);
    authRouter.route('/schedules/updateStatus').put(SchedulesController.updateStatus);
}

module.exports = SchedulesRoute;
