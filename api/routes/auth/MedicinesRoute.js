const MedicinesController = require('../../controllers/MedicinesController');

function MedicinesRoute(apiRouter) {
    apiRouter.route('/medicines/create').post(MedicinesController.create);
    apiRouter.route('/medicines/list').get(MedicinesController.list);
    apiRouter.route('/medicines/update').put(MedicinesController.update);
    apiRouter.route('/medicines/listActive').get(MedicinesController.listActive);
    apiRouter.route('/medicines/updateStatus').put(MedicinesController.updateStatus);
    apiRouter.route('/medicines/delete').put(MedicinesController.delete);
}

module.exports = MedicinesRoute;
