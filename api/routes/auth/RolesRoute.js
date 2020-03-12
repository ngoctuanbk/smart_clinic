const RolesController = require('../../controllers/RolesController');

function RolesRoute(apiRouter) {
    apiRouter.route('/roles/create').post(RolesController.create);
    apiRouter.route('/roles/listActive').get(RolesController.listActive);
}

module.exports = RolesRoute;
