
const mongoose = require('mongoose');
const Process = require('../models/process.js');
const Color = require('../models/color.js');
const ColorCat= require('../models/colorCat.js');
const User = require('../models/users.js');
module.exports =  function calculateCost(quantity,stamping,dyeingColor,userId,callback) {
    var total =0;
    Process.find({}).stream()
        .on('data', function (doc) {
            if (doc.optional === false){
                total = total +( quantity) * doc.price;
                console.log( "total obligatory = ",total)
            }
            else {
                if ((stamping === true)&& (doc.name === "Stamping")){
                    total = total +( quantity) * doc.price;
                    console.log("stamping", stamping, "total = ",total)
                }
                if (!(dyeingColor === "")&& (doc.name === "Dyeing")) {
                    Color.findOne({name: dyeingColor})
                        .then(color => {
                            if (!color) {
                                console.log("color was not found in our colors list!");
                            }
                            ColorCat.findOne({"_id": color._links.category.categoryId})
                                .then(colorCat => {
                                    total = total + (quantity) * colorCat.cost;
                                    User.findByIdAndUpdate(userId)
                                        .then(user => {
                                            if(!user) {
                                                console.log("user not found ")
                                            }
                                            user._embedded.totalSales = user._embedded.totalSales +total;
                                            user.save();
                                        });
                                    callback(total);

                                })

                        })
                }}})
        .on('error', function (err) {
        console.log(err)
    })

};
