const TopicServices = require('./../dbService/dbServiceHandler');

const router = require('express').Router();

router.get('/is_active', getIsActive);
router.get('/:module', getIsActiveBymodule)
router.post('', ping);
router.get('', getPing)
module.exports = router;

const mqttTopics = {
    led: "led",
    luminosity: "luminosity",
    temperature: "temperature"
}

/**
 * @openapi
 *  /ping/ NOT FUNCTIONNAL:
 *  get:
 *      tags:
 *          - ping
 *      description: Get if server was pinged < 120seconds
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *
 *      responses:
 *          200:
 *              description: return true or false
 * 
 *
 */ 
function getPing(req, res, next) {
    response = TopicServices.Ping.findByUser(req.user.sub);
    response.then((values) => {
        isActive = new Date() / 1000 - values.lastUpdate;
        res.status(200).send(isActive < 120 ? true : false);
    })
}

/**
 * @openapi
 *  /ping/ NOT FUNCTIONNAL:
 *  post:
 *      tags:
 *          - ping
 *      description: Send a ping to the server
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      "": ""
 *          401:
 *              description: Invalid token
 */ 
function ping(req, res, next) {
    if (TopicServices.Ping.findByUser(req.user.sub) == null)
        TopicServices.Ping.create({userId: req.user.sub, lastUpdate: new Date() / 1000 }).then((values) => {
            res.status(200).send();
        });
    else
        TopicServices.Ping.updateWithUser(req.user.sub, {lastUpdate: new Date() / 1000 }).then((values) => {
            res.status(200).send();
        });
}

/**
 * @openapi
 *  /ping/is_active:
 *  get:
 *      tags:
 *          - ping
 *      description: Get ping from all modules < 120s
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *
 *      responses:
 *          200:
 *              description: if ALL modules are under condition
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              isActive:
 *                                  type: boolean
 *          401:
 *              description: Invalid token
 * 
 *
 */ 
async function getIsActive(req, res, next) {
    agregates = {};
    for (topic in mqttTopics) {
        topicUpped = topic[0].toUpperCase() + topic.slice(1);
        agregates[topic] = await TopicServices[topicUpped].findByUser(req.user.sub).then((values) => {
            isActive = new Date() / 1000 - values.lastUpdate;
            return {
                module: values.name,
                lastUpdate: values.lastUpdate,
                isActive: isActive < 120 ? true : false
            };
        });
    }
    response = {isActive: true};
    for (topic in mqttTopics) {
        agregates[topic].isActive != true ? response.isActive = false: response.isActive = true;
    }
    console.log(response);
    res.send(response);
}

/**
 * @openapi
 *  /ping/{module}:
 *  get:
 *      tags:
 *          - ping
 *      description: Get ping from specified module
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *      parameters:
 *          - name: module
 *            description: "led/luminosity/lamp/temperature"
 *            required: true
 *            in: path
 *            type: string
 *
 *      responses:
 *          200:
 *              description: get if specified module was pinged in last 120s
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/modulePing'
 *          401:
 *              description: Invalid token
 * 
 *
 */ 
function getIsActiveBymodule(req, res, next) {
    topic = mqttTopics[req.params.module];
    topic = topic[0].toUpperCase() + topic.slice(1);

    TopicServices[topic].findByUser(req.user.sub).then((values) => {
        var diffUpdate = new Date() / 1000 - values.lastUpdate;
        res.send({
            module: values.name,
            lastUpdate: values.lastUpdate,
            isActive: diffUpdate < 120 ? true : false
        });
    });
}