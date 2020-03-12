const UsersController = require('../../controllers/UsersController');

// eslint-disable-next-line func-names
function UsersRoute(authRouter) {
    authRouter.route('/users').get(UsersController.index);
    authRouter.route('/users/add').get(UsersController.add);
    authRouter.route('/users/create').post(UsersController.create);
    authRouter.route('/users/list').get(UsersController.list);
}

module.exports = UsersRoute;
