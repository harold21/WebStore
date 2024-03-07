const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const express = require('express');
const {Purchase, validate} = require('../models/purchase');
const { Provider } = require('../models/provider');
const { Product } = require('../models/product');

const router = express.Router();

// GET: Retrieve all purchases
router.get('/', auth, async (req, res) => {

    const purchases = await Purchase.find().sort('purchaseDate');

    res.send(purchases);

});


// POST: Create a new purchase
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let provider = await Provider.findById(req.body.providerId);

    if (!provider) return res.status(400).send('The provider with the given ID was not found.');

    let products = [];

    for (let productDetail of req.body.products) {

        let product = await Product.findById(productDetail.productId);

        if (!product) return res.status(400).send('One of the products with the given ID was not found.');

        product.stock += productDetail.quantity;
        await product.save();

        products.push({
            _id: product._id,
            name: product.name,
            quantity: productDetail.quantity,
            price: productDetail.price
        });

    }


    let purchase = new Purchase({
        provider: {
            _id: provider._id,
            name: provider.name,
            email: provider.email,
            phone: provider.phone
        },
        products: products,
        total: req.body.total
    });

    await purchase.save();

    res.status(201).send(purchase);

});


// GET: Retrieve a single purchase by ID
router.get('/:id', auth, async (req, res) => {

    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) return res.status(404).send('The purchase with the given ID was not found.');

    res.send(purchase);

});


// DELETE: Delete a purchase by ID
router.delete('/:id', [auth, admin], async (req, res) => {

    const purchase = await Purchase.findByIdAndDelete(req.params.id);

    if (!purchase) return res.status(404).send('The purchase with the given ID was not found.');

    res.send(purchase);

});

module.exports = router;