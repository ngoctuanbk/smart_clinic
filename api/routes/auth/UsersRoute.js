const UsersController = require('../../controllers/UsersController');

function usersRoute(apiRouter) {
    apiRouter.route('/users/create').post(UsersController.create);
    apiRouter.route('/users/list').get(UsersController.list);
}
module.exports = usersRoute;
