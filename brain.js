const ORIENTATIONS = ["N", "E", "S", "O"];

module.exports = function (lawn, currentPosition) {

    var lawn;
    var currentPosition;

    return {
        execute: function(action) {

            var newPosition = {x: currentPosition.x, y: currentPosition.y, orientation: currentPosition.orientation};

            switch(action) {
                case "A":
                    goForward(newPosition);
                    break;
                case "D":
                    turnRight(newPosition);
                    break;
                case "G":
                    turnLeft(newPosition);
                    break;
                default:
                    // Erreur
            }

            // Validation de la nouvelle position
            if (!isOutOfBoundaries(newPosition)) {
                currentPosition = newPosition;
            }
        },
        getCurrentPosition: function() {
            return currentPosition;
        }
    };


    // Fonctions privées
    function isOutOfBoundaries(newPosition) {

        return newPosition.x < 0 || newPosition.x > lawn.width || newPosition.y < 0 || newPosition.y > lawn.height;
    }

    function goForward(newPosition) {

        // On verifie l'action à faire selon l'orientation actuelle
        switch (newPosition.orientation) {
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
        };

        return newPosition;
    };

    function turnLeft(newPosition) {

        var currentIndex = ORIENTATIONS.indexOf(newPosition.orientation);
        var index = (currentIndex == 0) ? ORIENTATIONS.length -1 : currentIndex - 1;

        newPosition.orientation = ORIENTATIONS[index];

        return newPosition;
    }

    function turnRight(newPosition) {

        var currentIndex = ORIENTATIONS.indexOf(newPosition.orientation);
        var index = ++currentIndex % ORIENTATIONS.length;

        newPosition.orientation = ORIENTATIONS[index];

        return newPosition;
    }
};

