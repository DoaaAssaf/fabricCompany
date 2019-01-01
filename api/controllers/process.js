'use strict';
const baseUrl = require("./../../config/urlConf");
const Process = require('../models/process.js');
const User = require('../models/users.js');
const shortid = require('shortid');


exports.findAll = findAll;


// Create and Save a new Process
exports.create = (req, res) => {

    var id=shortid.generate();
    const process = new Process({
        name: req.body.name,
        description: req.body.description,
        order:req.body.order,
        price:req.body.price,
        currency:req.body.currency,
        optional:req.body.optional,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "process-table/"+id

            },
        processTable: {
            href: baseUrl.baseURL+ "process-table/"

        }
        }
    });

    // Save Process in the database
    process.save()
        .then(data => {
            //  res.header("Access-Control-Allow-Origin", "*");
            //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            res.status(201).send(data);

        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Process."
        });
    });
};
// Retrieve and return all Processs from the database.
function  findAll (req, res) {
    Process.find({}, {'name': true,"_links.self":true})
        .then(process => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"process-table/"
                    }
                },
                _embedded:{
                    processsList:[ process]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Processes."
        });
    });

};
// Find a single Process with a ProcessId
exports.findOne = (req, res) => {
    Process.findById(req.params.processId)
        .then(process => {
            if(!process) {
                return res.status(404).send({
                    message: "Process not found with id " + req.params.processId
                });
            }
            res.send(process);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Process not found with id " + req.params.processId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Process with id " + req.params.processId
        });
    });
};
// Update a process identified by the ProcessId in the request
exports.update = (req, res) => {

    // Find Process and update it with the request body
    Process.findByIdAndUpdate(req.params.processId ,
        {name: req.body.name ,
            description: req.body.description,
            order:req.body.order,
            price:req.body.price,
            currency:req.body.currency,
            optional:req.body.optional}
        )
        .then(process => {
            if(!process) {
                return res.status(404).send({
                    message: "Process not found with id " + req.params.processId
                });
            }

            res.send(process);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Process not found with id " + req.params.processId
            });
        }
        return res.status(500).send({
            message: "Error updating Process with id " + req.params.processId
        });
    });
};
// Delete a Process with the specified ProcessId in the request
exports.delete = (req, res) => {
    Process.findByIdAndRemove(req.params.processId)
        .then(process => {
            if(!process) {
                return res.status(404).send({
                    message: "process not found with id " + req.params.processId
                });
            }
            res.send({message: "process deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "process not found with id " + req.params.processId
            });
        }
        return res.status(500).send({
            message: "Could not delete process with id " + req.params.processId
        });
    });
};



