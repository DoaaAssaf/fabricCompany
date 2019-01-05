
const mongoose = require('mongoose');
const Process = require('../models/process.js');
const User = require('../models/users.js');
const Yarn = require('../models/yarns.js');
module.exports =  function   checkForFabric(list,callback) {
    var total =0;
    var available= false;
    var availability=[false]
    var yarnPrices=[0]
        Yarn.find({}).stream()
            .on('data', function (doc) {
                for(var i = 0; i < list.length; i++) {
                if ((doc.code === list[i].code) &&(doc.NE === list[i].NE)  &&(doc.cables === list[i].cables) &&(doc.filament === list[i].filament)&&(doc.TPM === list[i].TPM)) {
                    total = total + doc.price;
                    available= true;
                    availability[i]=true
                    yarnPrices[i]=doc.price
                    continue;
                }
                }
            })

            .on('error', function (err) {
                console.log(err)
            })
            .on('end', function (err) {
                console.log(availability)
                callback(total,yarnPrices,availability)
                console.log(err)
            })








  // var  yarnt=0;
  //   const findYarn = async function (code,NE,cables,filament,TPM) {
  //       try {
  //           return await Yarn.findOne({
  //               "code": code,
  //               "NE": NE,
  //               "cables": cables,
  //               "filament": filament,
  //               "TPM": TPM
  //           }).sort('price')
  //
  //       }
  //       catch (err) {
  //           console.log(err)
  //       }
  //   }
  //   for(var i = 0; i < list.length; i++) {
  //       const foundYarn = findYarn({  "code": list[i].code,
  //           "NE": list[i].NE,
  //           "cables": list[i].cables,
  //           "filament": list[i].filament,
  //           "TPM": list[i].TPM}
  //          )
  //       console.log("fffffffffffffffffffffffffffffffffffffffound",foundYarn)
  //       yarnt =yarnt+foundYarn.price;
  //       console.log("yarnt =",yarnt)
  //       callback(yarnt);
  //   }
  //   callback(yarnt);
    }



    // const findUser = async function (params) {
    //     try {  return await User.findOne(params)
    //     } catch(err) { console.log(err) }
    // }
    //
    // const userSteve = findUser({firstName: Steve})

// list.forEach(function (elem) {
//     Yarn.findOne({"code":elem.code,"NE":elem.NE,"cables":elem.cables,"filament":elem.filament,"TPM":elem.TPM}).sort('price')
//         .exec(function (err, yarn) {
//             if (!yarn) {
//                 callback(null);
//             }
//             else{
//                 yarnt=yarnt+yarn.price;
//                 console.log("111111111111111",yarnt)
//             }
//         })
// })
    // Yarn.findOne({"code":code,"NE":NE,"cables":cables,"filament":filament,"TPM":TPM}).sort('price')
    //     .exec(function (err, yarn) {
    //         console.log(list)
    //         if (!yarn) {
    //             callback(null, false,null)
    //         }
    //         else{
    //             yarnPrice=yarn.price
    //             callback(yarnPrice,true,yarn._id)
    //         }
    //
    //     })


