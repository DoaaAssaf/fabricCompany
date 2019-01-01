const multer = require('multer');
const upload = multer({dis:'paints/'});
const Admin = require('../models/admins');
var realm  = require('express-http-auth').realm('Private Area');
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
var AdminAccess = [realm, checkForAdmin];

module.exports = (app) => {
    const admins = require('../controllers/admins.js');

    // Create a new Note
    app.post('/admin',AdminAccess, admins.create);

    // Retrieve all Notes
    app.get('/admin', AdminAccess,admins.findAll);

    // Retrieve a single Note with noteId
    app.get('/admin/:adminId',AdminAccess, admins.findOne);

    // Update a Note with noteId
    app.put('/admin/:adminId',AdminAccess,admins.update);

    // Delete a Note with noteId
    app.delete('/admin/:adminId',AdminAccess, admins.delete);

    // Retrieve chart
    app.get('/admin/chart/:chartName', AdminAccess,admins.getChart);

    app.post('/admin/chart',AdminAccess,upload.single('chart') ,admins.postChart);
}