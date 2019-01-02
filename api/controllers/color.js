'use strict';
const baseUrl = require("./../../config/urlConf");
const Color = require('../models/color.js');
const shortid = require('shortid');
const ColorCat = require('../models/colorCat.js');

exports.findAll = findAll;


// Create and Save a new Color
exports.create = (req, res) => {

    var id=shortid.generate();
    ColorCat.findByIdAndUpdate(req.params.colorCatId ,  {$addToSet: { colors: { colorName:req.body.name
                , _id: id,"_links.self.href": baseUrl.baseURL+ "colorCat/"+req.params.colorCatId+"/color/"+id}} })
        .then(colorCat => {


            if (!colorCat) {
                return res.status(404).send({
                    message: "ColorCat not found with id " + req.params.colorCatId
                });
            }
        });
    const color = new Color({
        name: req.body.name,
        hexCode: req.body.hexCode,
        currency:req.body.currency,
        _id : id,
        _links: {
            self:{
                href: baseUrl.baseURL+ "colorCat/"+req.params.colorCatId+"/color/"+id
            },
            category:{
                href: baseUrl.baseURL+ "colorCat/"+req.params.colorCatId,
                categoryId: req.params.colorCatId
        }}
    });

    // Save Color in the database
    color.save()
        .then(data => {

            res.status(201).send(data);


        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Color."
        });
    });
};
// Retrieve and return all Colors from the database.
function  findAll (req, res) {
    Color.find({}, {'name': true,"_links.self.href":true,"cost":true})
        .then(color => {
            res.json({
                _links: {
                    self:{
                        href: baseUrl.baseURL+"color/"
                    }
                },
                _embedded:{
                    colorsList:[ color]
                }
            });
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Colores."
        });
    });

};
// Find a single Color with a ColorId
exports.findOne = (req, res) => {
    Color.findById(req.params.colorId)
        .then(color => {
            if(!color) {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            res.send(color);
        }).catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res.status(404).send({
                            message: "Color not found with id " + req.params.colorId
                        });
                    }
                    return res.status(500).send({
                        message: "Error retrieving Color with id " + req.params.colorId
                    });
                });

};
// Update a color identified by the ColorId in the request
exports.update = (req, res) => {

    // Find Color and update it with the request body
    Color.findByIdAndUpdate(req.params.colorId )
        .then(color => {
            color.name = req.body.name || color.name;
            color.hexCode = req.body.hexCode || color.cost;
            if (!color) {
                return res.status(404).send({
                    message: "Color not found with id " + req.params.colorId
                });
            }
            ColorCat.findOneAndUpdate({"_id": req.params.colorCatId, "colors._id": req.params.colorId},{$set: {"colors.$.colorName": req.body.name || color.name  }})
                .then(colorCat => {
                    if (!colorCat) {
                        return res.status(404).send({
                            message: "error deleting  id " + req.params.colorId
                        });
                    }

                    res.send(color);
                })
        }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Color not found with id " + req.params.colorId
            });
        }
        return res.status(500).send({
            message: "Error updating Color with id " + req.params.colorId
        });
    });
};
// Delete a Color with the specified ColorId in the request
exports.delete = (req, res) => {
    Color.findByIdAndRemove(req.params.colorId)
        .then(color => {
            if (!color) {
                return res.status(404).send({
                    message: "color not found with id " + req.params.colorId
                });
            }
            ColorCat.findById(req.params.colorCatId)
                .then(colorCat => {
                    if (!colorCat) {
                        return res.status(404).send({
                            message: "error deleting  id " + req.params.colorId
                        });
                    }
                    colorCat.colors.id(req.params.colorId).remove();
                colorCat.save();
                });
            res.send({message: "color deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "color not found with id " + req.params.colorId
            });
        }
        return res.status(500).send({
            message: "Could not delete color with id " + req.params.colorId
        });
    });


};



