const express = require('express');
const routes = express.Router();

const userRoutes = require('./user.routes');
const customerRoutes = require('./customer.routes');
const stockRoutes = require('./stock.routes');
const memoRoutes = require('./memo.routes');
const invoiceRoutes = require('./invoice.routes');

routes.use('/user', userRoutes);
routes.use('/customer', customerRoutes);
routes.use('/stock', stockRoutes);
routes.use('/memo', memoRoutes);
routes.use('/invoice', invoiceRoutes);

module.exports = routes;