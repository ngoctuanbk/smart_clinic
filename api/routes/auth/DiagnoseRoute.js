const DiagnoseController = require('../../controllers/DiagnoseController');

function DiagnoseRoute(apiRouter) {
    apiRouter.route('/diagnose/create').post(DiagnoseController.create);
    apiRouter.route('/diagnose/list').get(DiagnoseController.list);
    apiRouter.route('/diagnose/update').put(DiagnoseController.update);

}

module.exports = DiagnoseRoute;
