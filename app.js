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

// Orientations
var ORIENTATIONS = ["N", "E", "S", "O"];

router.route('/execute').post(function (request, response) {

    // Information de la pelouse
    var lawn = {
        height: request.body.lawn.height,
        width: request.body.lawn.width
    };

    // Position initiale (par défaut 0,0,N)
    var currentPosition = {
        x: 0,
        y: 0,
        orientation: "N"
    };


    // Iteration sur les actions
    for (i = 0; i < request.body.actions.length; i++) {

        // Variable que contient la nouvelle position suite au mouvement
        var newPosition = {};

        var action = request.body.actions[i];
        switch (action) {
            case "A":
                newPosition = goForward(currentPosition);
                break;
            case "G":
                newPosition = turnLeft(currentPosition);
                break;
            case "D":
                newPosition = turnRight(currentPosition);
                break;
            default:
                // Exception
                console.error("Action non reconue");
        }

        // Validation de la nouvelle position
        if (!isOutOfBoundaries(lawn, newPosition)) {
            // Position valide. On fait le mouvement
            currentPosition = newPosition;
        }
        else {
            console.log("Out of boundaries");
        }
    }

    response.json(currentPosition);
});

function isOutOfBoundaries(lawn, newPosition) {

    return newPosition.x < 0 || newPosition.x >= lawn.width || newPosition.y < 0 || newPosition.y >= lawn.height;
}

function clonePosition(position) {

    return {
        x: position.x,
        y: position.y,
        orientation: position.orientation
    };
}

function goForward(currentPosition) {

    // On verifie l'action à faire selon l'orientation actuelle
    var newPosition = clonePosition(currentPosition);

    switch (currentPosition.orientation) {
        case "N":
            newPosition.y++;
            break;
        case "S":
            newPosition.y--;
            break;
        case "E":
            newPosition.x++;
            break;
        case "O":
            newPosition.x--;
    }
    ;

    return newPosition;
};

function turnLeft(currentPosition) {

    var newPosition = clonePosition(currentPosition);

    var currentIndex = ORIENTATIONS.indexOf(currentPosition.orientation);
    var index = (currentIndex == 0) ? ORIENTATIONS.length -1 : currentIndex - 1;

    newPosition.orientation = ORIENTATIONS[index];

    return newPosition;
}

function turnRight(currentPosition) {

    var newPosition = clonePosition(currentPosition);

    var currentIndex = ORIENTATIONS.indexOf(currentPosition.orientation);
    var index = ++currentIndex % ORIENTATIONS.length;

    newPosition.orientation = ORIENTATIONS[index];

    return newPosition;
}


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);