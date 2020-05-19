/* eslint-disable import/no-unresolved */
const express = require('express');

const authRouter = express.Router();
const auth = require('../../libs/passport');

authRouter.use((req, res, next) => {
    auth.isAuthenticated(req, res, next);
});
/* home */
require('./DashboardRoute')(authRouter);
/* user */
require('./UsersRoute')(authRouter);
/* role */
require('./RolesRoute')(authRouter);
/* brand */
require('./BrandsRoute')(authRouter);
/* province */
require('./ProvincesRoute')(authRouter);
/* patients */
require('./PatientsRoute')(authRouter);
/* schedules */
require('./SchedulesRoute')(authRouter);
/* labs */
require('./LabsRoute')(authRouter);
/* labs_result */
require('./LabResultsRoute')(authRouter);
/* medicines */
require('./MedicinesRoute')(authRouter);
/* images */
require('./ImagesRoute')(authRouter);



module.exports = authRouter;
