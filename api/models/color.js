
const mongoose = require('mongoose');

const ColorSchema = mongoose.Schema({
    _id: String,
    name: { type: String, required: true,unique:true},
    hexCode:{ type: String},
    _links: {
        self:{
            href: String
        },
        category:{
            href: String,
            categoryId: String
        }

    },
});

module.exports = mongoose.model('Color', ColorSchema);
