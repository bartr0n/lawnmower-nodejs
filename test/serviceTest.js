var assert = require('assert');
var amqp = require('amqplib/callback_api');

const app = require("../app.js");

describe('app', function () {

    it('rpcModeTest', function () {
        amqp.connect('amqp://localhost', function (error, connection) {
            connection.createChannel(function (error, channel) {
                channel.assertQueue('', {exclusive: true}, function (error, queue) {
                    var correlationId = generateCorrelationId();

                    console.log("Sending request...");

                    channel.sentToQueue('rpc_queue', new Buffer(JSON.stringify(generatePayload())),
                        {correlationId: correlationId, replyTo: queue.name});

                    // Recupération de la réponse du service
                    channel.consume(queue.queue, function(message) {
                        if (message.properties.correlationId == correlationId) {
                            // TODO console.log...
                        }
                    });
                });
            });
        });


    });
});

function generateCorrelationId() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}

function generatePayload() {
    return {
        lawn: {height: "5", width: "5"},
        initialPosition: {x: 1, y: 2, orientation: 'N'},
        actions: ['G', 'A', 'G', 'A', 'G', 'A', 'G', 'A', 'A']
    };
};
