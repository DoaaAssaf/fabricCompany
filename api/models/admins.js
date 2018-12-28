
const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    _id: String,
    adminName: { type: String, required: true, max: 40},
    email: { type: String, required: true,max:40},
    password:{ type: String, required: true, min:8},
    _links: {
        self:{
            href: String
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);
