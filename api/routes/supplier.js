
var realm  = require('express-http-auth').realm('Private Area');

const User = require('../models/users.js');
const Admin = require('../models/admins');
const Supplier= require('../models/suppliers');

var checkForAdmin = function(req, res, next) {
    Admin.findById(req.username).then(admin => {
        if ((admin) && (admin.password === req.password)) {
            next();
        } else {
            res.status(403).send({
                message: "error in password or username... check your credential!"
            });
        }
    });
};

var CheckAdminAndSupplierrAccess = function(req, res, next) {
    Admin.findById(req.username).then(admin => {
        if ((admin) && (admin.password === req.password)) {
            next();
        }
        else {
            Supplier.findById(req.username).then(supplier => {
                if ((supplier) && (supplier.password === req.password)) {
                    next();
                }
                else {
                    res.status(403).send({
                        message: "error in password or username... check your credential!"
                    });
                }
            }).catch(err => {
                res.status(403).send({
                    message: "Unauthorized... check your credential!"
                });
            });
        }
    });
};

var AdminAccess = [realm, checkForAdmin];
var adminAndSupplierAccess = [realm, CheckAdminAndSupplierrAccess];


module.exports = (app) => {
    const suppliers = require('../controllers/suppliers.js');

    // Create a new User
    app.post('/supplier',suppliers.create);

    // Retrieve all Users
    app.get('/supplier',AdminAccess,suppliers.findAll);

    // Retrieve a single User with noteId
    app.get('/supplier/:supplierId',adminAndSupplierAccess, suppliers.findOne);

    // Update a User with noteId
    app.put('/supplier/:supplierId',adminAndSupplierAccess, suppliers.update);

    // Delete a User with noteId
    app.delete('/supplier/:supplierId',adminAndSupplierAccess, suppliers.delete);

}