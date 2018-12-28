'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');


module.exports = app; // for testing


app.use(
    function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        return next();
    }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



app.get('/', (req, res) => {
    res.json({"message": "Welcome to our fabric company API"});
});



require('./api/routes/note.js')(app);
require('./api/routes/user.js')(app);
require('./api/routes/admin.js')(app);
var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);


    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
});
