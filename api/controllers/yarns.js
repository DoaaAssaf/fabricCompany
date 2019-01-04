'use strict';
const baseUrl = require("./../../config/urlConf");
var util = require('util');
const Supplier = require('../models/suppliers.js');
const shortid = require('shortid');
const Yarn = require('../models/yarns.js');



exports.findAll = findAll;


// Create and Save a new Yarn
exports.create = (req, res) => {
    // Validate request
    // Create a Yarn
    var id=shortid.generate();
    const yarn = new Yarn({
        name: req.body.name,
        code: req.body.code,
        NE: req.body.NE,
        cables:req.body.cables,
        filament:req.body.filament,
        TPM:req.body.TPM,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "yarn/"+id

            }
        },
        _embedded:{
            supplier:{
                _links:{
                    self:{
                        href: baseUrl.baseURL + "supplier/"+req.username
                    },

                },
                _id: req.username,
            }
        },
        price: req.body.price,
        currency: req.body.currency
    });

    // Save Yarn in the database
    yarn.save()
        .then(data => {
            res.status(201).send(data);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Yarn."
        });
    });
};
// Retrieve and return all Yarns from the database.
function  findAll (req, res) {
    Yarn.find({}, {'name': true,"_links.self.href":true})
        .then(yarn => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"yarn/"
                    }
                },
                _embedded:{
                    yarnsList:[ yarn]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Yarns."
        });
    });
};
// Find a single Yarn with a YarnId
exports.findOne = (req, res) => {
    Yarn.findById(req.params.yarnId)
        .then(yarn => {
            if(!yarn) {
                return res.status(404).send({
                    message: "Yarn not found with id " + req.params.yarnId
                });
            }
            res.send(yarn);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Yarn not found with id " + req.params.yarnId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Yarn with id " + req.params.yarnId
        });
    });
};
// Update a yarn identified by the YarnId in the request
exports.update = (req, res) => {
    // Find Yarn and update it with the request body
    Yarn.findOneAndUpdate({"_id":req.params.yarnId},{$set: {
            "name": req.body.name,
            "code": req.body.code,
            "NE": req.body.NE,
            "cables":req.body.cables,
            "filament":req.body.filament,
            "TPM":req.body.TPM,
            "price":req.body.price
    }})
        .then(yarn => {
            if(!yarn) {
                return res.status(404).send({
                    message: "Yarn not found with id " + req.params.yarnId
                });
            }
            res.send(yarn);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Yarn not found with id " + req.params.yarnId
            });
        }
        return res.status(500).send({
            message: "Error updating Yarn with id " + req.params.yarnId
        });
    });
};
// Delete a Yarn with the specified YarnId in the request
exports.delete = (req, res) => {
    Yarn.findByIdAndRemove(req.params.yarnId)
        .then(yarn => {
            if(!yarn) {
                return res.status(404).send({
                    message: "yarn not found with id " + req.params.yarnId
                });
            }
            res.send({message: "yarn deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "yarn not found with id " + req.params.yarnId
            });
        }
        return res.status(500).send({
            message: "Could not delete yarn with id " + req.params.yarnId
        });
    });
};



