'use strict';
const baseUrl = require("./../../config/urlConf");
const ColorCat = require('../models/colorCat.js');
const User = require('../models/users.js');
const shortid = require('shortid');
const Color = require('../models/color.js');

exports.findAll = findAll;


// Create and Save a new ColorCat
exports.create = (req, res) => {

    var id=shortid.generate();
    const colorCat = new ColorCat({
        name: req.body.name,
        cost: req.body.cost,
        currency:req.body.currency,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "colorCat/"+id
            },
            colors:{
            href: baseUrl.baseURL+ "colorCat/"+id+"/color/"
        }}
    });

    // Save ColorCat in the database
    colorCat.save()
        .then(data => {

            res.status(201).send(data);

        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the ColorCat."
        });
    });
};
// Retrieve and return all ColorCats from the database.
function  findAll (req, res) {
    ColorCat.find({}, {'name': true,"_links.self.href":true,"cost":true})
        .then(colorCat => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"colorCat/"
                    }
                },
                _embedded:{
                    colorCatsList:[ colorCat]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving ColorCates."
        });
    });

};
// Find a single ColorCat with a ColorCatId
exports.findOne = (req, res) => {
    ColorCat.findById(req.params.colorCatId)
        .then(colorCat => {
            if(!colorCat) {
                return res.status(404).send({
                    message: "ColorCat not found with id " + req.params.colorCatId
                });
            }
            res.send(colorCat);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "ColorCat not found with id " + req.params.colorCatId
            });
        }
        return res.status(500).send({
            message: "Error retrieving ColorCat with id " + req.params.colorCatId
        });
    });
};
// Update a colorCat identified by the ColorCatId in the request
exports.update = (req, res) => {

    // Find ColorCat and update it with the request body
    ColorCat.findByIdAndUpdate(req.params.colorCatId , {$addToSet: { colors: { name: 'something', username: 'something' }} })
        .then(colorCat => {

            colorCat.name= req.body.name || colorCat.name;
                colorCat.cost=req.body.cost || colorCat.cost;
                colorCat.currency=req.body.currency  || colorCat.currency;
              //  colorCat.colors=req.body.colors || colorCat.colors;



            if(!colorCat) {
                return res.status(404).send({
                    message: "ColorCat not found with id " + req.params.colorCatId
                });
            }

            res.send(colorCat);
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "ColorCat not found with id " + req.params.colorCatId
            });
        }
        return res.status(500).send({
            message: "Error updating ColorCat with id " + req.params.colorCatId
        });
    });
};
// Delete a ColorCat with the specified ColorCatId in the request
exports.delete = (req, res) => {
    ColorCat.findByIdAndRemove(req.params.colorCatId)
        .then(colorCat => {

            if(!colorCat) {
                return res.status(404).send({
                    message: "colorCat not found with id " + req.params.colorCatId
                });
            }

            for (var i = 0; i < colorCat.colors.length; i++) {
                var color = colorCat.colors[i];
                console.log("color._id =",color._id);
                Color.findByIdAndRemove(color._id).then(
                    color => {

                        if (!color) {
                            return res.status(404).send({
                                message: "color not found with id " + color._id
                            });
                        }
                    })
            }

            res.send({message: "colorCat deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "colorCat not found with id " + req.params.colorCatId
            });
        }
        return res.status(500).send({
            message: "Could not delete colorCat with id " + req.params.colorCatId
        });
    });
};



