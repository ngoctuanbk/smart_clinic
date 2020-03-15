
const util = require('util');
const express = require('express');

const apiRouter = express.Router();
const {
    verifyToken,
} = require('../../libs/common');

apiRouter.use(async (req, res, next) => {
    verifyToken(req, res, next);
});

/* roles */
require('./RolesRoute')(apiRouter);
/* users */
require('./UsersRoute')(apiRouter);
/* brands */
require('./BrandsRoute')(apiRouter);
/* provinces */
require('./ProvincesRoute')(apiRouter);
/* districts */
require('./DistrictsRoute')(apiRouter);
/* wards */
require('./WardsRoute')(apiRouter);
/* patients */
require('./PatientsRoute')(apiRouter);
/* schedules */
require('./SchedulesRoute')(apiRouter);

module.exports = apiRouter;
