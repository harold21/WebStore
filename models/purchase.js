const mongoose = require('mongoose');
const Joi = require('joi');

const purchaseSchema = new mongoose.Schema({

    provider: {
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
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
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
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
        min: 0,
        required: true
    }

});

const Purchase = mongoose.model('Purchase', purchaseSchema);


function validatePurchase(Purchase) {

    const schema = Joi.object({
        providerId: Joi.objectId().required(),
        products: Joi.array().items(Joi.object({
            productId: Joi.objectId().required(),
            name: Joi.string().min(3).required(),
            quantity: Joi.number().min(1).required(),
            price: Joi.number().min(0).required()
        })).required(),
        total: Joi.number().min(0).required()
    });

    return schema.validate(Purchase);

}


exports.purchaseSchema = purchaseSchema;
exports.Purchase = Purchase;
exports.validate = validatePurchase;