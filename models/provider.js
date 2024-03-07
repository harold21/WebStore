const mongoose = require('mongoose');
const Joi = require('joi');

const providerSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }

});


const Provider = mongoose.model('Provider', providerSchema);

function validateProvider(provider) {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(5).max(50).required()
    });

    return schema.validate(provider);

}


exports.providerSchema = providerSchema;
exports.Provider = Provider;
exports.validate = validateProvider;