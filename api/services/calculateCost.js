
const mongoose = require('mongoose');
const Process = require('../models/process.js');
const Color = require('../models/color.js');
const ColorCat= require('../models/colorCat.js');
const User = require('../models/users.js');
module.exports =  function calculateCost(quantity,stamping,dyeing,dyeingColor,userId,callback) {
    var total =0;
    Process.find({}).stream()
        .on('data', function (doc) {
            if (doc.optional === false){
                total = total +( quantity) * doc.price;
                console.log( "total ",doc.name," = ",total)
            }
            else {
                if ((stamping === true)&& (doc.name === "Stamping")&&(dyeing === false)){
                    total = total +( quantity) * doc.price;
                    console.log("stamping", stamping, "total = ",total);
                    callback(total,"")
                }
                else if ((dyeing === true)&& (doc.name === "Dyeing")&&(stamping === false) ) {
                    Color.findOne({name: dyeingColor})
                        .then(color => {
                            if (color) {
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
                                        callback(total,"");

                                    })
                            }else {
                                callback(0,"color was not found in our colors list!");
                            }
                        })
                }
                else if ((dyeing === true)&& (doc.name === "Dyeing")&&((stamping === true)) ) {
                    Color.findOne({name: dyeingColor})
                        .then(color => {
                            if (color) {
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
                                        getStampingPrice(function (StampingPrice) {
                                            total=total+StampingPrice;
                                            callback(total,"");
                                        })


                                    })
                            }else {
                                callback(0,"color was not found in our colors list!");
                            }
                        })
                }
                else if ((dyeing === false)&&((stamping === false)) ){
                    getobligatedFieldsCosr(quantity,function (obCost) {
                        callback(obCost,"")
                    })

                }
            }})

        .on('error', function (err) {
        console.log(err)
    })

};

function getStampingPrice(calliy) {
    Process.findOne({"name":"Stamping"})
        .then(doc => {
                StampingPrice = doc.price;
                calliy(doc.price)
            })
        }
function getobligatedFieldsCosr(quantity,cb) {
    var obCost=0;
    Process.find({}).stream()
        .on('data', function (doc) {
            if (doc.optional === false) {
                obCost = obCost + (quantity) * doc.price;

            }
        })
            .on("end",function () {
                cb(obCost);
            })

}
