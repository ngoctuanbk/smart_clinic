const LabDetailController = require('../../controllers/LabDetailController');

function LabDetailRoute(apiRouter) {
    apiRouter.route('/lab_details/importFile').post(LabDetailController.importFile);
    apiRouter.route('/lab_details/info').get(LabDetailController.infoLab);
}

module.exports = LabDetailRoute;
