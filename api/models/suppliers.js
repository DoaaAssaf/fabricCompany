
const mongoose = require('mongoose');

const SupplierSchema = mongoose.Schema({
    _id: String,
    suppliername: { type: String, required: true, max: 40},
    email: { type: String, required: true,max:40},
    password:{ type: String, required: true, min:8},
    Api:{ type: String, required: true, min:8},
    _links: {
        self:{
            href: String
        },
        yarnsList:{
            self:{
                href: String
            }
        }
    },
    _embedded:{
        yarnRequest:[{
            _links:{
                self:{
                    href: String
                }
            },
            _id: String
        }],
        yarns:[{
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

module.exports = mongoose.model('Supplier', SupplierSchema);