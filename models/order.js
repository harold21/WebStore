const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = new mongoose.Schema({
    
    user: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            }
        }),
        required: true
    },
    products: [{
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                min: 1,
                required: true
            },
            price: {
                type: Number,
                min: 0,
                required: true
            }
        }),
        required: true
    }],
    orderDate: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        min: 0,
        required: true
    }
});


const Order = mongoose.model('Order', orderSchema);


function validateOrder(Order) {

    const schema = Joi.object({
        userId: Joi.objectId().required(),
        products: Joi.array().items(Joi.object({
            productId: Joi.objectId().required(),
            name: Joi.string().min(3).required(),
            quantity: Joi.number().min(1).required()
        })).required()
    });

    return schema.validate(Order);

}


exports.orderSchema = orderSchema;
exports.Order = Order;
exports.validate = validateOrder;