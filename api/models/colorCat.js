
const mongoose = require('mongoose');

const ColorCatSchema = mongoose.Schema({
    _id: String,
    name: { type: String, required: true,unique:true},
    cost: { type: Number, required:true},
    currency: { type: String, required:true},
    colors:[
        {
            _id: String,
            colorName: {type: String},
            _links: {
                self:{
                    href: String
                }
            }
        }
    ],
    _links: {
        self:{
            href: String
        },
        colors:{
            href: String
        }
    },
});

module.exports = mongoose.model('ColorCat', ColorCatSchema);
