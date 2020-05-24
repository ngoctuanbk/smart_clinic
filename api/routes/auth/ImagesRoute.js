const ImagesController = require('../../controllers/ImagesController');

function ImagesRoute(apiRouter) {
    apiRouter.route('/images/create').post(ImagesController.create);
    apiRouter.route('/images/list').get(ImagesController.list);
    apiRouter.route('/images/update').put(ImagesController.update);
    apiRouter.route('/images/listByPatient').get(ImagesController.listByPatient);
    apiRouter.route('/images/updateStatus').put(ImagesController.updateStatus);
}

module.exports = ImagesRoute;
