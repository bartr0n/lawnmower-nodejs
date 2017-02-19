// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express

const brainModule = require("./brain.js");

// Module de gestion rabbitMQ
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error, connection) {
    connection.createChannel(function (error, channel) {
        var queueName = "lawnmower-request-queue"

        channel.assertQueue(queueName, {durable: false});

        console.log("Waiting for petitions...");

        channel.consume(queueName, function (message) {
            // Code gerant la tendeuse
            console.log("Message received: lawn=" + message.content.lawn + ", initialPosition=" + message.content.initialPosition);

            const brain = brainModule(message.content.lawn, message.content.initialPosition);
            for (i = 0; i < message.content.actions.length; i++) {
                brain.execute(message.content.actions[i]);
            }

            // Envoi de la réponse au client??

        });
    });
});