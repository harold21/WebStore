const express = require('express');
const provider = require('../routes/provider');
const users = require('../routes/user');
const purchase = require('../routes/purchase');
const order = require('../routes/order');
const product = require('../routes/product');
const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/providers', provider);
    app.use('/api/users', users);
    app.use('/api/purchases', purchase);
    app.use('/api/orders', order);
    app.use('/api/products', product);
    app.use('/api/auth', auth);

    app.use(error);

}