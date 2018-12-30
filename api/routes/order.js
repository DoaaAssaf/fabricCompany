const multer = require('multer');
const upload = multer({dis:'paints/'});
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
    const orders = require('../controllers/orders.js');

    // Create a new Order
    app.post('/order', userAccess ,orders.create);

    // Retrieve all Orders
    app.get('/order',adminAndUserAccess, orders.findAll);

    // Retrieve a single Order with noteId
    app.get('/order/:orderId',adminAndUserAccess,orders.findOne);

    // Update a Order with noteId
    app.put('/order/:orderId',AdminAccess,orders.update);

    // Delete a Order with noteId
    app.delete('/order/:orderId', AdminAccess,orders.delete);

}