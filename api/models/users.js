
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: String,
    username: { type: String, required: true, max: 40},
    email: { type: String, required: true,max:40},
    password:{ type: String, required: true, min:8},
    _links: {
        self:{
            href: String
        }
    },
    _embedded:{
        orders:[{
            _links:{
                self:{
                    href: String
                }
            },
            _id: String
        }],
        totalSales: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);