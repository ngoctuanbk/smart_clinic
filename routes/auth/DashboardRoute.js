const DashboardsController = require('../../controllers/DashboardsController');

// eslint-disable-next-line func-names
function DashboardRoute(authRouter) {
    authRouter.route('/').get(DashboardsController.index);
    authRouter.route('/dashboards').get(DashboardsController.index);
}

module.exports = DashboardRoute;
