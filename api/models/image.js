
const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    _id: String,
    contentType: String,
    image:  new Buffer(String, 'base64'),
    _links: {
        self: {
            href: String
        },
        owner: {
            href: String,
            userName: String
        },
        order: {
            href: String,
            orderId: String
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', ImageSchema);
