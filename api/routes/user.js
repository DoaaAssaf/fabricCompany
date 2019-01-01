
var realm  = require('express-http-auth').realm('Private Area');

const User = require('../models/users.js');
const Admin = require('../models/admins');

var checkUserAccess= function(req, res, next) {
    User.findById(req.username).then(user => {
        if ((user) && (user.password === req.password)) {
            next();
        } else {
            res.status(403).send({
                message: "error in password or username... check your credential!"
            });
        }
    });
};

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

var CheckdminAndUserAccess = function(req, res, next) {
    Admin.findById(req.username).then(admin => {
        if ((admin) && (admin.password === req.password)) {
            next();
        }
        else {
            User.findById(req.username).then(user => {
                if ((user) && (user.password === req.password)) {
                    next();
                }
                else {
                    res.status(403).send({
                        message: "error in password or username... check your credential!"
                    });
                }
            });
        }
    });
};
var userAccess = [realm, checkUserAccess];
var AdminAccess = [realm, checkForAdmin];
var adminAndUserAccess = [realm, CheckdminAndUserAccess];


module.exports = (app) => {
    const users = require('../controllers/users.js');

    // Create a new User
    app.post('/user', adminAndUserAccess,users.create);

    // Retrieve all Users
    app.get('/user',AdminAccess, users.findAll);

    // Retrieve a single User with noteId
    app.get('/user/:userId',adminAndUserAccess, users.findOne);

    // Update a User with noteId
    app.put('/user/:userId',adminAndUserAccess, users.update);

    // Delete a User with noteId
    app.delete('/user/:userId',adminAndUserAccess, users.delete);

}