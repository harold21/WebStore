const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const express = require('express');
const {Order, validate} = require('../models/order');
const { User } = require('../models/user');
const { Product } = require('../models/product');

const router = express.Router();

// GET: Retrieve all orders
router.get('/', auth, async (req, res) => {

    const orders = await Order.find().sort('orderDate');

    res.send(orders);

});


// POST: Create a new order
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.body.userId);

    if (!user) return res.status(400).send('The user with the given ID was not found.');

    let products = [];
    let calculatedTotal = 0;

    for (let productDetail of req.body.products) {

        let product = await Product.findById(productDetail.productId);

        if (!product) return res.status(400).send('One of the products with the given ID was not found.');

        product.stock -= productDetail.quantity;
        await product.save();

        let subtotal = product.price * productDetail.quantity;
        calculatedTotal += subtotal;

        products.push({
            _id: product._id,
            name: product.name,
            quantity: productDetail.quantity,
            price: product.price
        });

    }


    let order = new Order({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        products: products,
        total: calculatedTotal
    });

    await order.save();

    res.status(201).send(order);

});


// GET: Retrieve a single order by ID
router.get('/:id', auth, async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);

});


// DELETE: Delete a order by ID
router.delete('/:id', [auth, admin], async (req, res) => {

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).send('The order with the given ID was not found.');

    res.send(order);

});

module.exports = router;