const LabsController = require('../../controllers/LabsController');

// eslint-disable-next-line func-names
function LabsRoute(authRouter) {
    authRouter.route('/labs').get(LabsController.index);
    authRouter.route('/labs/list').get(LabsController.list);
    authRouter.route('/labs/create').post(LabsController.create);
    authRouter.route('/labs/update').put(LabsController.update);
    authRouter.route('/activities/list').get(LabsController.listActivity);
    authRouter.route('/labs/importFile').post(LabsController.importFile);
}

module.exports = LabsRoute;
