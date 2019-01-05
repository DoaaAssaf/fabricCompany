'use strict';
const baseUrl = require("./../../config/urlConf");
var util = require('util');
const Order = require('../models/order.js');
const User = require('../models/users.js');
const Comfirmation = require('../models/confirmation');
const Process = require('../models/process.js');

const Chart = require('../models/chart');
const shortid = require('shortid');
const Image = require('../models/image.js');
exports.findAll = findAll;
const multer = require('multer');
const upload = multer({dis:'paints/'});
var path = require('path');
const fs = require('fs');
var calculateCost = require('./../services/calculateCost');
var checkForFabric = require('./../services/checkForFabric');
exports.create = (req, res) => {

  calculateCost(req.body.quantity,req.body.stamping,req.body.dyeing,req.body.dyeingColor,req.username,function(total,error) {
      var totalyarnCost=0;
              var arr = [];
              for(var i = 0; i < req.body.fabricSpec.length; i++) {
                  arr [i] = req.body.fabricSpec[i]
              }
                  checkForFabric(req.body.fabricSpec, function (yarnCost, yarnPrices,availablity) {
                      for(var i = 0; i < req.body.fabricSpec.length; i++) {
                      var elem =arr[i];
                      if(availablity[i] === false)
                      {
                          elem.yarnCost = null;
                          elem.available =false;
                          console.log("element not  available =",elem)
                          continue;
                      }
                      else{
                          elem.yarnCost = yarnPrices[i];
                          elem.available =true;
                          console.log("element available =",elem)
                      }

    var id = shortid.generate();
    var  imgUrl = null;
    var stampingImgUploaded = false;
    if (req.body.stamping === true){
        imgUrl= baseUrl.baseURL+"order/"+id+"/stampingImg";
    }
    const order = new Order({
        _id: id,
        stamping: req.body.stamping,
        StampingImage:
            {
                link:imgUrl,
                uploaded: stampingImgUploaded
            },
        dyeingColor: req.body.dyeingColor || "",
        dyeing: req.body.dyeing,
        quantity: req.body.quantity,
        deliveryDate: req.body.deliveryDate,
        deliveryPlace: req.body.deliveryPlace,
        fabricSpec:arr,

        _links: {
            self: {
                href: baseUrl.baseURL + "order/" + id
            },
            owner: {
                href: baseUrl.baseURL + "user/" + req.username,

            }
        },
        _embedded: {
                invoice: {
                    self: {
                        href: null
                    }
                },
                costDetails: {
                    self:
                        {
                            href: baseUrl.baseURL+"order/"+id+ "/cost-details/"
                        }
                },
                confirmation: {
                    self: {
                        href: baseUrl.baseURL+"order/"+id+ "/confirmation/"
                    }
                },
                stampingImg: {
                    self: {
                        href:  imgUrl
                    }
                }
            },
        totalyarn:yarnCost*req.body.quantity,
        confirmed: false,
        totalCost: total+(yarnCost*req.body.quantity)+( total+(yarnCost*req.body.quantity) *15/100),
        currency: "$",
        status: "pending"

    });
      if ((error==="color was not found in our colors list!") || (error==="error!")||(error ==="user Not found")) {
          console.log(error)
          return res.status(400).send({
              message: error
          })
      }

    order.save().then(data => {
            User.findOneAndUpdate({"_id": req.username}, {
        $addToSet: {
                       "_embedded.orders":{
                            "_links.self.href": baseUrl.baseURL + "order/" + id,
                            "_id": id
                        }
                }
            }).then(user => {
                    if (!user) {
                        return res.status(500).send({
                            message: " error while adding the order to the user : " + req.username
                        })
                    }
                res.status(201).send(data);
                })

    });
                      }
                  })
          });


};
// Retrieve and return all Orders from the database.
function  findAll (req, res) {
    Order.find({}, {'orderName': true,"_links":true})
        .then(order => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"order/"
                    }
                },
                _embedded:{
                    ordersList:[ order]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Orders."
        });
    });
}
// Find a single Order with a OrderId
exports.findOne = (req, res) => {
    Order.findById(req.params.orderId)
        .then(order => {
            if(!order) {
                return res.status(404).send({
                    message: "Order not found with id " + req.params.orderId
                });
            }
            res.send(order);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Order with id " + req.params.orderId
        });
    });
};
// Update a order identified by the OrderId in the request
exports.update = (req, res) => {
    // Find Order and update it with the request body
    Order.findByIdAndUpdate(req.params.orderId, {status:req.body.status})
        .then(order => {
            if(!order) {
                return res.status(404).send({
                    message: "Order not found with id " + req.params.orderId
                });
            }
            res.send(order);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error updating Order with id " + req.params.orderId
        });
    });
};
// Delete a Order with the specified OrderId in the request
exports.delete = (req, res) => {
    Order.findByIdAndRemove(req.params.orderId)
        .then(order => {
            if(!order) {
                return res.status(404).send({
                    message: "order not found with id " + req.params.orderId
                });
            }
            res.send({message: "order deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "order not found with id " + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Could not delete order with id " + req.params.orderId
        });
    });
};
exports.postImg = (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    Order.findById(req.params.orderId).then(order => {
        if (!order) {
            return res.status(404).send({
                message: "cannot upload image : order not found with id " + req.params.orderId
            });
        }
        else if ((order.stamping === false ) || (order.StampingImage.uploaded === true)){
            return res.status(400).send({
                message: "cannot upload image : you didn't request a stamping image or you already uploaded it  "
            });
        }else {
            var id = shortid.generate();
            const image = new Image({
                _id: id,
                contentType: req.file.mimetype,
                image:  Buffer.from(encode_image, 'base64'),
                _links: {
                    self: {
                        href: baseUrl.baseURL + "order/" + req.params.orderId +"/stampingImg"
                    },
                    owner: {
                        href: baseUrl.baseURL + "user/" + req.username,
                        userName:  req.username
                    },
                    order: {
                        href:  baseUrl.baseURL + "order/" + req.params.orderId,
                        orderId: req.params.orderId
                    }
                }
            });
            image.save()
                .then(data => {
                    res.json({
                            _id: id,
                            contentType:req.file.mimetype,
                        _links: {
                            self: {
                                href: baseUrl.baseURL + "order/" + req.params.orderId +"/stampingImg"
                            },
                            owner: {
                                href: baseUrl.baseURL + "user/" + req.username,
                                userName:  req.username
                            },
                            order: {
                                href:  baseUrl.baseURL + "order/" + req.params.orderId,
                                orderId: req.params.orderId
                            }
                        }
                        }
                    );
                    Order.findByIdAndUpdate(req.params.orderId)
                        .then(order => {
                            order.StampingImage.uploaded = true;
                            console.log(order);
                            order.save();
                        });

                }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Order."
                });
            });
        }
    });
};
exports.getImg = (req, res) => {
    Image.findOne({"_links.order.orderId":req.params.orderId})
        .then(image => {
            if(!image) {
                return res.status(404).send({
                    message: "cannot find Image: Order not found with id " + req.params.orderId
                });
            }
            res.contentType('image/jpeg');
            res.send(image.image);

        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "cannot find image" + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Order with id " + req.params.orderId
        });
    });
};
exports.postConfirmation = (req, res) => {
    var id = shortid.generate();
    const comfirmation = new Comfirmation({
        _id: id,
        confirmation: req.body.confirmation,
        _links: {
            self: {
                href: baseUrl.baseURL + "order/" + req.params.orderId +"/confirmation"
            },
            owner: {
                href: baseUrl.baseURL + "user/" + req.username
            },
            order: {
                href: baseUrl.baseURL + "order/"+req.params.orderId,
                orderId:req.params.orderId
            }
        }
    });
    Order.findByIdAndUpdate(req.params.orderId)
        .then(order => {
            order.confirmed = true;
            order.save();
        });
    comfirmation.save()
        .then(data => {
            res.status(201).send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });
};
exports.getConfirmation = (req, res) => {
    Comfirmation.findOne({"_links.order.orderId":req.params.orderId})
        .then(confirmation => {
            if(!confirmation) {
                return res.status(404).send({
                    message: "cannot find confirmation link: Order not found with id " + req.params.orderId
                });
            }

            res.send(confirmation);

        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "cannot find image" + req.params.orderId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Order with id " + req.params.orderId
        });
    });
};