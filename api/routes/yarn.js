
var realm  = require('express-http-auth').realm('Private Area');

const Supplier = require('../models/suppliers.js');
const Admin = require('../models/admins');

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
            });
        }
    });
};

var adminAndSupplierAccess = [realm, CheckAdminAndSupplierrAccess];


module.exports = (app) => {
    const yarns = require('../controllers/yarns.js');

    // Create a yarn
    app.post('/yarn', adminAndSupplierAccess,yarns.create);

    // Retrieve yarn
    app.get('/yarn', yarns.findAll);

    // Retrieve a single yarn
    app.get('/yarn/:yarnId', yarns.findOne);

    // Update a yarn
    app.put('/yarn/:yarnId',adminAndSupplierAccess, yarns.update);

    // Delete a yarn
    app.delete('/yarn/:yarnId',adminAndSupplierAccess, yarns.delete);

}