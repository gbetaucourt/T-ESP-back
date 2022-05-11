const constants = require('env.js');
const dbHandler = require('./mqttDbHandler');
const client = require('./setSocket').client;

const mqttTopics = require('./mqttConstants').mqttTopics;

function listen() {
    client.on("message", (topic, message) => {
        try {
            parsedMessage = JSON.parse(message);
        } catch(e) {
            console.log("CATCH = " + e + "values = " + topic + " | " + message);
            return;
        }
        parsedMessage.lastUpdate = Math.round(new Date() / 1000);
        //parsedMessage.lastUpdate = (parsedMessage.lastUpdate.setHours("+1"));
        //parsedMessage.lastUpdate = parsedMessage.lastUpdate;
        console.log(parsedMessage);
        switch (topic) {
            case constants.mqttBaseTopic +  getTopic(mqttTopics.Led):
                dbHandler.updateTopic(parsedMessage.iotId,mqttTopics.Led, parsedMessage.value, parsedMessage.lastUpdate);
                break;

            case constants.mqttBaseTopic +  getTopic(mqttTopics.Luminosity):
                dbHandler.updateTopic(parsedMessage.iotId, mqttTopics.Luminosity, parsedMessage.value, parsedMessage.lastUpdate);
                break;
            
            case constants.mqttBaseTopic +  getTopic(mqttTopics.Temperature):
                dbHandler.updateTopic(parsedMessage.iotId, mqttTopics.Temperature, parsedMessage.value, parsedMessage.lastUpdate);
                break;
            
            case constants.mqttBaseTopic +  getTopic(mqttTopics.Lamp):
                dbHandler.updateTopic(parsedMessage.iotId, mqttTopics.Lamp, parsedMessage.value, parsedMessage.lastUpdate);
                break;
                
                case constants.mqttBaseTopic +  getTopic(mqttTopics.Humidity):
                    dbHandler.updateTopic(parsedMessage.iotId, mqttTopics.Humidity, parsedMessage.value, parsedMessage.lastUpdate);
                    break;
        }
    })
}
function getTopic(topic) {
    returnTopîc = topic[0].toLowerCase() + topic.slice(1);
    return returnTopîc;
}
module.exports = {
    listen: listen,
};
