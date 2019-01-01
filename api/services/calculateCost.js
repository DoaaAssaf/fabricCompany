
const mongoose = require('mongoose');
const Process = require('../models/process.js');

module.exports =  function calculateCost(quantity,stamping,dyeingColor,callback) {
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
                if (!(dyeingColor === "")&& (doc.name === "Dyeing")){
                    total = total +( quantity) * doc.price;
                    console.log("color", dyeingColor, "total = ",total)
                }
            }
        })
        .on('error', function (err) {
            console.log(err)
        })
        .on('end', function () {
            console.log("quantity = ",quantity)
            console.log("total at the end = ",total)
            callback(total);


        });
};
