
const mongoose = require('mongoose');

const ProcessSchema = mongoose.Schema({
    _id: String,
    name: { type: String, required: true},
    description: { type: String, required:true},
    order: { type: Number, required:true,unique:true},
    price: { type: Number, required:true},
    currency: { type: String, required:true},
    optional: { type: Boolean, required:true, default:false},

    _links: {
        self:{
            href: String
        },
        processTable: {
            href: String,

        }
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Process', ProcessSchema);
