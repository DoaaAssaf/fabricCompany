'use strict';
const baseUrl = require("./../../config/urlConf");
var util = require('util');
const Order = require('../models/order.js');
const User = require('../models/users.js');
const Chart = require('../models/chart');
const shortid = require('shortid');
exports.findAll = findAll;
const multer = require('multer');
const upload = multer({dis:'paints/'});
const fs = require('fs');

exports.create = (req, res) => {

    var id = shortid.generate();
    var  imgUrl = null;
    if (req.body.stampingImg === true){
        imgUrl= baseUrl.baseURL+"order/"+id+"/stampingImg";
    }
    const order = new Order({
        _id: id,
        stampingImg: req.body.stampingImg,
        dyeingColor: req.body.dyeingColor,
        quantity: req.body.quantity,
        deliveryDate: req.body.deliveryDate,
        deliveryPlace: req.body.deliveryPlace,
        fabricSpec: req.body.fabricSpec,
        _links: {
            self: {
                href: baseUrl.baseURL + "order/" + id
            },
            owner: {
                href: baseUrl.baseURL + "user/" + req.username,
                // $ref: "user",
                // $id: userId,
                // $db: "fabricCompanyDB",
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
            }
        ,
        confirmed: false,
        totalCost: 12,
        currency: "$",
        status: "pending"

    });
    order.save()
        .then(data => {
            res.status(201).send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
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
};
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
    // Validate Request
    if(!req.body.orderName || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "order name and email and password can not be empty"
        });
    }

    // Find Order and update it with the request body
    Order.findByIdAndUpdate(req.params.orderId, {
        orderName: req.body.orderName ,
        email: req.body.email,
        password: req.body.password
    }, {new: true})
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


// Find a single Order with a OrderId
exports.getChart = (req, res) => {
    Chart.findById(req.params.chartName, {'chart': true})
        .then(chart => {
           // res.sendFile(__dirname + "/1_lR6oU5-XKHH_8I9S-hjOqg.png");
            if(!chart) {
                return res.status(404).send({
                    message: "Chart not found with id " + req.params.chartName
                });
            }
       //     res.send(chart);

            res.contentType('image/jpeg');
            res.end(chart,"binary");
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "chart not found with id " + req.params.chartName
            });
        }
        return res.status(500).send({
            message: "Error retrieving chart with id " + req.params.chartName
        });
    });
};
exports.postChart = (req, res) => {

    // Validate request
    console.log("Create was called");
console.log(req.file);

    // Create a Order
    var id=shortid.generate();

    const chart = new Chart({
        _id : id,
        chart: fs.readFileSync("A:\\fabricCompany\\fabric2\\api\\paints\\"),
        _links: {
            self:{
                href: baseUrl.baseURL+ "order/chart/"+id
            }
        }
    });

    // Save Order in the database
    chart.save()
        .then(data => {
            //  res.header("Access-Control-Allow-Origin", "*");
            //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.status(201).send(data);

        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });
};