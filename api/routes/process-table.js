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
    const process = require('../controllers/process.js');

    // Create a new Order
    app.post('/process-table', AdminAccess ,process.create);

    // Retrieve all Orders
    app.get('/process-table',adminAndUserAccess, process.findAll);

    // Retrieve a single Order with noteId
    app.get('/process-table/:processId',adminAndUserAccess,process.findOne);

    // Update a Order with noteId
    app.put('/process-table/:processId',AdminAccess,process.update);

    // Delete a Order with noteId
    app.delete('/process-table/:processId', AdminAccess,process.delete);

}