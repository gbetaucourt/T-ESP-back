const constants = require('env.js');
const client = require('./setSocket').client

function sendLedStatus(ledStatus) {
    client.publish(constants.mqttBaseTopic + 'led/status', ledStatus, function(err) {
        if (err) {console.log(err)}
    });
    
}

function sendLampStatus(lampStatus) {
    console.log("ahah " + lampStatus)
    client.publish(constants.mqttBaseTopic + 'lamp/status', lampStatus, function(err) {
        if (err) {console.log(err)}
    });
}

function listen() { 

}

module.exports = {
    listen: listen,
    sendLedStatus: sendLedStatus,
    sendLampStatus: sendLampStatus
}