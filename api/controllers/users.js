'use strict';
const baseUrl = require("./../../config/urlConf");
var util = require('util');
const User = require('../models/users.js');
const shortid = require('shortid');
const multer = require('multer');
const upload = multer({dis:'paints/'});

exports.findAll = findAll;


// Create and Save a new User
exports.create = (req, res) => {
    if(!req.body.username|| !req.body.password) {
        return res.status(400).send({
            message: "bad request user name and email and password can not be empty"
        });
    }

    // Create a User
    var id=shortid.generate();
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "user/"+id

            }
        },
        _embedded:{
            orders:[{
                _links:{
                    self:{
                        href: baseUrl.baseURL + "orders/"
                    }
                },
                _id: null
            }],
            totalSales: 0
        }
    });

    // Save User in the database
    user.save()
        .then(data => {
       res.status(201).send(data);

        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });
};
// Retrieve and return all Users from the database.
function  findAll (req, res) {

        if (req.query.top10 === 'true'){
            console.log(req.query);
            var mysort = {'_embedded.totalSales': -1 };
            User.find().sort(mysort).limit(10)
                .then(user => {
                    res.json({
                        _links: {
                            self:{
                                href: baseUrl.baseURL+"user/"
                            }
                        },
                        _embedded:{
                            usersList: user
                        }
                    });
                }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving Users."
                });
            });

        }

    else {
        console.log('should have query string');

    User.find({}, {'username': true,"_links":true})
        .then(user => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"user/"
                    }
                },
                _embedded:{
                    usersList:[ user]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Users."
        });
    });
}
};
// Find a single User with a UserId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.userId
        });
    });
};
// Update a user identified by the UserId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "user name and email and password can not be empty"
        });
    }

    // Find User and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username ,
        email: req.body.email,
        password: req.body.password
    }, {new: true})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Error updating User with id " + req.params.userId
        });
    });
};
// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "user not found with id " + req.params.userId
                });
            }
            res.send({message: "user deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};



