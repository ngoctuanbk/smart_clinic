const SchedulesController = require('../../controllers/SchedulesController');

// eslint-disable-next-line func-names
function SchedulesRoute(authRouter) {
    authRouter.route('/schedules').get(SchedulesController.index);
    authRouter.route('/schedules/list').get(SchedulesController.list);
}

module.exports = SchedulesRoute;
