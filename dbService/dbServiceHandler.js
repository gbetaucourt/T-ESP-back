const LedService = require("./service/ledService");
const LuminService = require("./service/luminService");
const TempService = require("./service/tempService");
const PingService = require('./service/pingService');
const LampService = require('./service/lampService');
const HumiService = require('./service/humiService')

const topicServices = {
    Led: LedService,
    Luminosity: LuminService,
    Temperature: TempService,
    Ping: PingService,
    Lamp: LampService,
    Humidity: HumiService,
}

module.exports = topicServices;