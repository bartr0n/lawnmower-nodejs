#!/usr/bin/env node

/**
 * Created by joseam on 20/02/2017.
 */

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
        var channelName = 'lawnmower-request-queue';

        var payload = {
            "actions": "AAAAGD",
            "lawn": {
                "height": "2",
                "width": "2"
            },
            "initialPosition": {
                "x": "0",
                "y": "0",
                "orientation": "N"
            }
        };

        channel.assertQueue(channelName, {durable: false});
        channel.sendToQueue(channelName, new Buffer(JSON.stringify(payload)));
    });
});
