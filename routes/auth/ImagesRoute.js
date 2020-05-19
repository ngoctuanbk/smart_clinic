const ImagesController = require('../../controllers/ImagesController');

// eslint-disable-next-line func-names
function ImagesRoute(authRouter) {
    authRouter.route('/images').get(ImagesController.index);
    authRouter.route('/images/create').post(ImagesController.create);
    authRouter.route('/images/list').get(ImagesController.list);
    authRouter.route('/images/update').put(ImagesController.update);
}

module.exports = ImagesRoute;
