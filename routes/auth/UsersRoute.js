const UsersController = require('../../controllers/UsersController');

// eslint-disable-next-line func-names
function UsersRoute(authRouter) {
    authRouter.route('/users').get(UsersController.index);
    authRouter.route('/users/add').get(UsersController.add);
    authRouter.route('/users/edit').get(UsersController.edit);
    authRouter.route('/users/create').post(UsersController.create);
    authRouter.route('/users/list').get(UsersController.list);
    authRouter.route('/users/listDoctorActive').get(UsersController.listDoctorActive);
    authRouter.route('/users/update').put(UsersController.update);
    authRouter.route('/users/getUser').get(UsersController.getUser);
    authRouter.route('/users/updateStatus').put(UsersController.updateStatus);
    authRouter.route('/users/delete').put(UsersController.delete);
    authRouter.route('/users/updateAvatar').put(UsersController.updateAvatar);
    authRouter.route('/users/exportFile').get(UsersController.exportFile);
}

module.exports = UsersRoute;
