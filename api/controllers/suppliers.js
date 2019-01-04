'use strict';
const baseUrl = require("./../../config/urlConf");
var util = require('util');
const Supplier = require('../models/suppliers.js');
const shortid = require('shortid');
const multer = require('multer');
const upload = multer({dis:'paints/'});

exports.findAll = findAll;


// Create and Save a new Supplier
exports.create = (req, res) => {
    // Validate request
    // Create a Supplier
    var id=shortid.generate();
    const supplier = new Supplier({
        suppliername: req.body.suppliername,
        email: req.body.email,
        password: req.body.password,
        Api:req.body.Api,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "supplier/"+id

            },
            yarnsList:{
                self:{
                  href: baseUrl.baseURL+ "yarn/"
                }
            }
        },
        _embedded:{
            yarnRequest:[{
                _links:{
                    self:{
                        href: ""
                    }
                },
                _id: ""
            }],
            totalSales: 0
        }
    });

    // Save Supplier in the database
    supplier.save()
        .then(data => {
            res.status(201).send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Supplier."
        });
    });
};
// Retrieve and return all Suppliers from the database.
function  findAll (req, res) {
    Supplier.find({}, {'suppliername': true,"_links.self.href":true})
        .then(supplier => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"supplier/"
                    }
                },
                _embedded:{
                    suppliersList:[ supplier]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Suppliers."
        });
    });
};
// Find a single Supplier with a SupplierId
exports.findOne = (req, res) => {
    Supplier.findById(req.params.supplierId)
        .then(supplier => {
            if(!supplier) {
                return res.status(404).send({
                    message: "Supplier not found with id " + req.params.supplierId
                });
            }
            res.send(supplier);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Supplier not found with id " + req.params.supplierId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Supplier with id " + req.params.supplierId
        });
    });
};
// Update a supplier identified by the SupplierId in the request
exports.update = (req, res) => {
    // Find Supplier and update it with the request body
    Supplier.findByIdAndUpdate(req.params.supplierId, {
        suppliername: req.body.suppliername ,
        email: req.body.email,
        password: req.body.password
    }, {new: true})
        .then(supplier => {
            if(!supplier) {
                return res.status(404).send({
                    message: "Supplier not found with id " + req.params.supplierId
                });
            }
            res.send(supplier);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Supplier not found with id " + req.params.supplierId
            });
        }
        return res.status(500).send({
            message: "Error updating Supplier with id " + req.params.supplierId
        });
    });
};
// Delete a Supplier with the specified SupplierId in the request
exports.delete = (req, res) => {
    Supplier.findByIdAndRemove(req.params.supplierId)
        .then(supplier => {
            if(!supplier) {
                return res.status(404).send({
                    message: "supplier not found with id " + req.params.supplierId
                });
            }
            res.send({message: "supplier deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "supplier not found with id " + req.params.supplierId
            });
        }
        return res.status(500).send({
            message: "Could not delete supplier with id " + req.params.supplierId
        });
    });
};



