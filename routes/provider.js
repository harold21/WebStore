const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const express = require('express');
const {Provider, validate} = require('../models/provider');

const router = express.Router();

// GET: Retrieve all providers
router.get('/', auth, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const providers = await Provider
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort('name');

    res.send(providers);

});


// GET: Retrieve a single provider by ID
router.get('/:id', auth, async (req, res) => {

    const provider = await Provider.findById(req.params.id);

    if (!provider) return res.status(404).send('The provider with the given ID was not found.');

    res.send(provider);

});


// POST: Create a new provider
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let provider = await Provider.findOne({ email: req.body.email });

    if (provider) return res.status(400).send('Provider with the same email already registered.');

    provider = new Provider({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    });

    await provider.save();

    res.status(201).send(provider);

});


// PUT: Update a provider by ID
router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const provider = await Provider.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }, { new: true });


    if (!provider) return res.status(404).send('The provider with the given ID was not found.');

    res.send(provider);

});


// DELETE: Delete a provider by ID
router.delete('/:id', [auth, admin], async (req, res) => {

    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) return res.status(404).send('The provider with the given ID was not found.');

    res.send(provider);

});

module.exports = router;