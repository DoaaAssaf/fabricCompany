'use strict';
const baseUrl = require("./../../config/urlConf");
var util = require('util');
const Admin = require('../models/admins.js');
const AdminsList = require('../models/adminsList.js');
const shortid = require('shortid');
exports.findAll = findAll;


// Create and Save a new Admin
exports.create = (req, res) => {
    // Validate request
    console.log("Create was called");
    if(!req.body.adminName|| !req.body.password) {
        return res.status(400).send({
            message: "bad request admin name and email and password can not be empty"
        });
    }

    // Create a Admin
    var id=shortid.generate();
    const admin = new Admin({
        adminName: req.body.adminName,
        email: req.body.email,
        password: req.body.password,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "admin/"+id
            }
        }
    });

    // Save Admin in the database
    admin.save()
        .then(data => {
            //  res.header("Access-Control-Allow-Origin", "*");
            //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.status(201).send(data);

        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Admin."
        });
    });
};
// Retrieve and return all Admins from the database.
function  findAll (req, res) {
    Admin.find({}, {'adminName': true,"_links":true})
        .then(admin => {
            res.send(admin);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Admins."
        });
    });
};
// Find a single Admin with a AdminId
exports.findOne = (req, res) => {
    Admin.findById(req.params.adminId)
        .then(admin => {
            if(!admin) {
                return res.status(404).send({
                    message: "Admin not found with id " + req.params.adminId
                });
            }
            res.send(admin);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Admin not found with id " + req.params.adminId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Admin with id " + req.params.adminId
        });
    });
};
// Update a admin identified by the AdminId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.adminName || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "admin name and email and password can not be empty"
        });
    }

    // Find Admin and update it with the request body
    Admin.findByIdAndUpdate(req.params.adminId, {
        adminName: req.body.adminName ,
        email: req.body.email,
        password: req.body.password
    }, {new: true})
        .then(admin => {
            if(!admin) {
                return res.status(404).send({
                    message: "Admin not found with id " + req.params.adminId
                });
            }
            res.send(admin);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Admin not found with id " + req.params.adminId
            });
        }
        return res.status(500).send({
            message: "Error updating Admin with id " + req.params.adminId
        });
    });
};
// Delete a Admin with the specified AdminId in the request
exports.delete = (req, res) => {
    Admin.findByIdAndRemove(req.params.adminId)
        .then(admin => {
            if(!admin) {
                return res.status(404).send({
                    message: "admin not found with id " + req.params.adminId
                });
            }
            res.send({message: "admin deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "admin not found with id " + req.params.adminId
            });
        }
        return res.status(500).send({
            message: "Could not delete admin with id " + req.params.adminId
        });
    });
};



