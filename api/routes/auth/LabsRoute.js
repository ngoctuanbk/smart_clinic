const LabsController = require('../../controllers/LabsController');

function LabsRoute(apiRouter) {
    apiRouter.route('/labs/create').post(LabsController.create);
    apiRouter.route('/labs/list').get(LabsController.list);
    apiRouter.route('/labs/listByPatient').get(LabsController.listByPatient);
    apiRouter.route('/labs/update').put(LabsController.update);
    apiRouter.route('/labs/importFile').post(LabsController.importFile);
    apiRouter.route('/labs/updateStatus').put(LabsController.updateStatus);
}

module.exports = LabsRoute;
