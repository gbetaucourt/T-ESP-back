
const constants = require('env.js');
const mqtt = require('mqtt');
const connectUrl = `mqtt://${constants.mqttHost}:${constants.mqttPort}`
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const mqttTopics = require('./mqttConstants').mqttTopics;

const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: constants.mqttClientId,
        password: constants.mqttPassword,
        reconnectPeriod: 1000
    });

    client.on('connect', () => {
        for(topic in mqttTopics) {
            client.subscribe(constants.mqttBaseTopic +  getTopic(topic), () => {
                console.log('subscribed');
            })
        }
    })

module.exports = {
    client
}

function getTopic(topic) {
    returnTopîc = topic[0].toLowerCase() + topic.slice(1);
    return returnTopîc;
}
