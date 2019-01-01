
const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    _id: String,
    stamping: { type: Boolean, required: true, default:false},
    StampingImage: {
        link:String,
        uploaded:Boolean
    },
    dyeingColor: { type: String},
    quantity: { type: Number, required: true},
    deliveryDate: { type: String, required:true},
    deliveryPlace: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        country: {type: String, required: true},
        zipCode: {type: Number, required: true}
    },
    fabricSpec:[
        {
            code: {type: String, required: true,default: "co"},
            NE: {type: Number, required: true,default: 1},
            cables: {type: Number, required: true,default: 1},
            filament: {type: Number, required: true,default:1},
            TPM: {type: Number, required: true,default: 1},
            percentage:{type: Number, required: true}
        }
    ],

    _links: {
        self:{
            href: String
        },
        owner: {
                href: String,
                userName: String
            }
    },
    _embedded: {
            invoice: {
                    self: {
                            href: String
                        }
                },
            costDetails: {
                    self:
                        {
                            href: String
                        }
                },
            confirmation: {
                    self: {
                            href: String
                        }
                },
            stampingImg: {
                    self: {
                            href: String
                        }
                }
        },
    confirmed:{ type: Boolean},
    totalCost: {type:Number},
    currency:{type:String},
    status:{type:String}

}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
