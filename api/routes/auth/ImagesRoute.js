const ImagesController = require('../../controllers/ImagesController');

function ImagesRoute(apiRouter) {
    apiRouter.route('/images/create').post(ImagesController.create);
    apiRouter.route('/images/list').get(ImagesController.list);
    apiRouter.route('/images/update').put(ImagesController.update);
}

module.exports = ImagesRoute;
