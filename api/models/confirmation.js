
const mongoose = require('mongoose');

const ConfirmationSchema = mongoose.Schema({
    _id: String,
    confirmation: { type: Boolean, required: true, default:false},
    _links: {
        self:{
            href: String
        },
        owner: {
            href: String
        },
        order: {
            href: String,
            orderId:String
        }
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Confirmation', ConfirmationSchema);
