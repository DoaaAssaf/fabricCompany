
const mongoose = require('mongoose');

const YarnSchema = mongoose.Schema({
    _id: String,
    name: { type: String, required: true},
    code:{ type: String, required: true},
    NE:{ type: Number, required: true, min:5,max:200},
    cables:{ type: Number, required: true,min:1,max:4},
    filament:{ type: Number, required: true,min:1,max:124},

    TPM: { type: Number, required: true,min:0,max:140},
    _embedded:{
        supplier:{
            _links: {
                self: {
                    href: String
                },

            },
            _id: String,

        }
    },
    price: { type: Number, required: true},
    currency: { type: String, required: true},
    _links: {
        self:{
            href: String
        }
    }
});

module.exports = mongoose.model('Yarn', YarnSchema);