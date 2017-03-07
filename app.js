var events = require('events');

const eventEmitter = new events.EventEmitter();

// Instantiation du module brain de la tendeuse
const brainModule = require("./brain.js");

// Module de gestion rabbitMQ
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error, connection) {
    connection.createChannel(function (error, channel) {

        var exchange = "lawnmower.exchange";

        channel.assertExchange(exchange, 'direct', {durable: false});
        channel.assertQueue('', {exclusive: true}, function (error, q) {
            console.log("Waiting for petitions...");

            channel.bindQueue(q.queue, exchange, '');

            channel.consume(q.queue, function (message) {

                // Récupération du payload et initialisation de la tendeuse
                var payload = JSON.parse(message.content);
                const brain = brainModule(payload.lawn, payload.initialPosition);

                for (i = 0; i < payload.actions.length; i++) {
                    brain.execute(payload.actions[i]);
                }
                ;

                eventEmitter.emit('complete', brain.getCurrentPosition(), message);
            });
        });


        // Callback de l'evenement
        eventEmitter.on('complete', function (finalPosition, intialMessage) {
            console.log("Final position: [x=" + finalPosition.x + ", y=" + finalPosition.y + ", orientation=" + finalPosition.orientation + "]");

            // On répond au client utilisant la callbackQueue passée
            channel.sendToQueue(initialMessage.properties.replyTo, new Buffer(JSON.stringify(finalPosition)), {correlationId: initialMessage.properties.correlationId});
            channel.ack(message);
        });
    });
});

