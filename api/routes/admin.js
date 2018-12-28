module.exports = (app) => {
    const admins = require('../controllers/admins.js');

    // Create a new Note
    app.post('/admin', admins.create);

    // Retrieve all Notes
    app.get('/admin', admins.findAll);

    // Retrieve a single Note with noteId
    app.get('/admin/:adminId', admins.findOne);

    // Update a Note with noteId
    app.put('/admin/:adminId', admins.update);

    // Delete a Note with noteId
    app.delete('/admin/:adminId', admins.delete);

}