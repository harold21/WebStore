const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const express = require('express');
const {Product, validate} = require('../models/product');

const router = express.Router();

// GET: Retrieve all product
router.get('/', auth, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const product = await Product
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort('name');

    res.send(product);

});


// GET: Retrieve a single product by ID
router.get('/:id', auth, async (req, res) => {

    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);

});


// POST: Create a new product
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    });

    await product.save();

    res.status(201).send(product);

});


// PUT: Update a product by ID
router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    }, { new: true });


    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);

});


// DELETE: Delete a product by ID
router.delete('/:id', [auth, admin], async (req, res) => {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);

});

module.exports = router;