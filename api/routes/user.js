module.exports = (app) => {
    const users = require('../controllers/users.js');

    // Create a new Note
    app.post('/user', users.create);

    // Retrieve all Notes
    app.get('/user', users.findAll);

    // Retrieve a single Note with noteId
    app.get('/user/:userId', users.findOne);

    // Update a Note with noteId
    app.put('/user/:userId', users.update);

    // Delete a Note with noteId
    app.delete('/user/:userId', users.delete);

}