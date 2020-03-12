const RolesController = require('../../controllers/RolesController');

// eslint-disable-next-line func-names
function RolesRoute(authRouter) {
    authRouter.route('/roles/listActive').get(RolesController.listActive);
}

module.exports = RolesRoute;
