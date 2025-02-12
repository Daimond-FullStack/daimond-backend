const express = require('express');
const routes = express.Router();

const userRoutes = require('./user.routes');
const customerRoutes = require('./customer.routes');
const stockRoutes = require('./stock.routes');
const memoRoutes = require('./memo.routes');
const invoiceRoutes = require('./invoice.routes');
const expenseRoutes = require('./expense.routes');
const purchaseRoutes = require('./purchase.routes');

routes.use('/user', userRoutes);
routes.use('/customer', customerRoutes);
routes.use('/stock', stockRoutes);
routes.use('/memo', memoRoutes);
routes.use('/invoice', invoiceRoutes);
routes.use('/expense', expenseRoutes);
routes.use('/purchase', purchaseRoutes);

module.exports = routes;