// Test de la classe Brain

var assert = require('assert');
const brainModule = require("../brain.js");

describe('brain', function () {


    it('Test1', function () {

        var payload = {
            lawn: {height: "5", width: "5"},
            initialPosition: {x: 1, y: 2, orientation: 'N'},
            actions: ['G', 'A', 'G', 'A', 'G', 'A', 'G', 'A', 'A']
        };

        abstractTest(payload, {x: 1, y: 3, orientation: 'N'});
    });

    it('Test2', function () {

        var payload = {
            lawn: {height: "5", width: "5"},
            initialPosition: {x: 3, y: 3, orientation: 'E'},
            actions: ['A', 'A', 'D', 'A', 'A', 'D', 'A', 'D', 'D', 'A']
        };

        abstractTest(payload, {x: 5, y: 1, orientation: 'E'});
    });
});

function abstractTest(payload, expectedFinalPosition) {

    var brain = brainModule(payload.lawn, payload.initialPosition);

    payload.actions.forEach(function (action) {
        brain.execute(action);
    });

    var finalPosition = brain.getCurrentPosition();

    // Test
    assert.equal(finalPosition.x, expectedFinalPosition.x);
    assert.equal(finalPosition.y, expectedFinalPosition.y);
    assert.equal(finalPosition.orientation, expectedFinalPosition.orientation);
}