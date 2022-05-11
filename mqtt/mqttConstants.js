const mqttTopics = {
    Led: "Led",
    Luminosity: "Luminosity",
    Temperature: "Temperature",
    Lamp: "Lamp",
    Humidity: "Humidity",
};

const modulesConstants = {
    Luminosity: 300,
};

module.exports = {
    mqttTopics: mqttTopics,
    moduleConstants: modulesConstants
}