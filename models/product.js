const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        min: 0,
        default: 0
    },
    price: {
        type: Number,
        min: 0,
        required: true
    }

});


const Product = mongoose.model('Product', productSchema);

function validateProduct(product) {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        stock: Joi.number().min(0),
        price: Joi.number().min(0).required()
    });

    return schema.validate(product);

}


exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateProduct;