const LabsController = require('../../controllers/LabsController');

// eslint-disable-next-line func-names
function LabsRoute(authRouter) {
    authRouter.route('/labs').get(LabsController.index);
    authRouter.route('/labs/list').get(LabsController.list);
    authRouter.route('/labs/listByPatient').get(LabsController.listByPatient);
    authRouter.route('/labs/create').post(LabsController.create);
    authRouter.route('/labs/update').put(LabsController.update);
    authRouter.route('/activities/list').get(LabsController.listActivity);
    authRouter.route('/lab_details/importFile').post(LabsController.importFile);
    authRouter.route('/lab_details/info').get(LabsController.info);
    authRouter.route('/labs/updateStatus').put(LabsController.updateStatus);

}

module.exports = LabsRoute;
