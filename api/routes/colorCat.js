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
    const colorCats = require('../controllers/colorCat.js');

    // Create a new ColorCat
    app.post('/colorCat', AdminAccess ,colorCats.create);

    // Retrieve all ColorCats
    app.get('/colorCat',adminAndUserAccess, colorCats.findAll);

    // Retrieve a single ColorCat with noteId
    app.get('/colorCat/:colorCatId',adminAndUserAccess,colorCats.findOne);

    // Update a ColorCat with noteId
    app.put('/colorCat/:colorCatId',AdminAccess,colorCats.update);

    // Delete a ColorCat with noteId
    app.delete('/colorCat/:colorCatId', AdminAccess,colorCats.delete);

}