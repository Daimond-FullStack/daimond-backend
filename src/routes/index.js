const express = require('express');
const routes = express.Router();

const userRoutes = require('./user.routes');
const customerRoutes = require('./customer.routes');
const stockRoutes = require('./stock.routes');

routes.use('/user', userRoutes);
routes.use('/customer', customerRoutes);
routes.use('/stock', stockRoutes);

module.exports = routes;