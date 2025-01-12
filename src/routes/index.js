const express = require('express');
const routes = express.Router();

const userRoutes = require('./user.routes');
const customerRoutes = require('./customer.routes');

routes.use('/user', userRoutes);
routes.use('/customer', customerRoutes);

module.exports = routes;