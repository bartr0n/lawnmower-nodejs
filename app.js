// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

const brainModule = require("./brain.js");

// Orientations
var ORIENTATIONS = ["N", "E", "S", "O"];

router.route('/execute').post(function (request, response) {

    // Création du brain
    const brain = brainModule(request.body.lawn, request.body.initialPosition);

    // Iteration sur les actions
    for (i=0; i<request.body.actions.length; i++) {
        brain.execute(request.body.actions[i]);
    }

    response.json(brain.getCurrentPosition());
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);