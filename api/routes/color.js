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
    const colors = require('../controllers/color.js');

    // Create a new Color
    app.post('/colorCat/:colorCatId/color', AdminAccess ,colors.create);

    // Retrieve all Colors
    app.get('/colorCat/:colorCatId/color',adminAndUserAccess, colors.findAll);

    // Retrieve a single Color
    app.get('/colorCat/:colorCatId/color/:colorId',adminAndUserAccess,colors.findOne);

    // Update a Color
    app.put('/colorCat/:colorCatId/color/:colorId',AdminAccess,colors.update);

    // Delete a Color
    app.delete('/colorCat/:colorCatId/color/:colorId', AdminAccess,colors.delete);

}