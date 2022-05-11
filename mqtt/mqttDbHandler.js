const UserService = require('./../dbService/service/userService');
const TopicServices = require('./../dbService/dbServiceHandler');
const sender = require('./send');
const constants = require('env.js');
const mqttTopics = require('./mqttConstants').mqttTopics;

const topicExceptions =  {
    Luminosity : luminosityException
};

async function luminosityException(iotId, name, value, tmpModule) {
    message = false;
    TopicServices.Lamp.findByIotId(iotId).then((module, err) => {
        if (module.descp === "true" ) {
            /*if (tmpModule.value <= 300 && value <= 300) {
                console.log("BLABLAH");
                return "false";

            } else if (tmpModule.value >= 300 && value >= 300) {
                console.log("BLOHBLOH");
                return "false";
            }*/
            value >= 300 ? message = "day" : message = "night";
            sender.sendLampStatus(message);
            return "true";
        }
    })
}

function isException(name) {
    toCheck = Object.keys(topicExceptions);
    if (toCheck == name)
        return true;
    return false;
}

async function createModule(userId, name, value, lastUpdate, iotId) {
    await TopicServices[mqttTopics[name]].create({
        userId: userId,
        name: name,
        value: value,
        lastUpdate: lastUpdate,
        iotId: iotId
    });
}

async function updateModule(userId, name, value, lastUpdate, iotId) {
    await TopicServices[mqttTopics[name]].updateModule(
        {iotId: iotId},
        {value: value, lastUpdate: lastUpdate},
    )
}

async function CheckTopicKindAndUpdate(iotId, name, value, lastUpdate) {
    user = await UserService.getUserByIotId(iotId);
    if (user == null)
        return;
    tmpModule = await TopicServices[mqttTopics[name]].findByUser(user._id);
    /*if (mqttTopics[name] == mqttTopics.Luminosity) {
        if (tmpModule.value <= 300 && value <= 300) {
            console.log('already night')
            return;
        }
        else if (tmpModule.value >= 300 && value >= 300) {
            console.log('Already day')
            return;
        }
    }*/
    
    if (isException(name)) {
        topicExceptions[name](iotId, name, value, tmpModule)
        
    }
    if (tmpModule == null) {
        createModule(user._id, name, value, lastUpdate, user.iotId)
    } else {
        updateModule(user._id, name, value, lastUpdate, user.iotId)
    }
    
        
    console.log('updateModule name = ' + name);
}

module.exports = {
    updateTopic: CheckTopicKindAndUpdate
}