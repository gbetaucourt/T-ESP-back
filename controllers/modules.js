const TopicServices = require('./../dbService/dbServiceHandler');
const UserService = require('./../dbService/service/userService');
const mqttHandler = require('./../mqtt/send');
const router = require('express').Router();

router.get('/:module', getModuleValue);
router.post('/id', setIotId);
router.post('/led/status', setLed);
router.post('/lamp/status', setLamp);
router.get('/lamp/status', getLamp)
module.exports = router;

const mqttTopics = {
    led: "led",
    luminosity: "luminosity",
    temperature: "temperature",
    lamp: "lamp",
    humidity: "humidity",
}

/**
 * @openapi
 *  /sensors/lamp/status:
 *  get:
 *      tags:
 *          - modules
 *      description: get if lamp automatisation on/off
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
 *                      properties:
 *                          status:
 *                              example: true/false
 *          401:
 *              description: Invalid token
 */ 
 async function getLamp(req, res, next) {
    lampModule = TopicServices.Lamp.findByUser(req.user.sub).then((value, err) => {
        if (value == null || value == undefined)
            res.sendStatus(401);
        res.send({status: lampModule.descp});
    });
}

/**
 * @openapi
 *  /sensors/lamp/status:
 *  post:
 *      tags:
 *          - modules
 *      description: Turn lamp automatisation on/off
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              example: true/false
 * 
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      "": ""
 *          401:
 *              description: Invalid token
 */ 
async function setLamp(req, res, next) {
    console.log("body = " + JSON.stringify(req.body));
    return await UserService.getById(req.user.sub).then( async (user, err) => {
        console.log("user = " + JSON.stringify(user));
        await TopicServices.Lamp.updateModule(
            {iotId: user.iotId},
            {descp: req.body.status === "true" ? "false": "true"},
            {}
        )
        return res.sendStatus(200);
    })
   
    /*req.body.status == "true" ?
    TopicServices.Lamp.updateDscp({iotId: req.user.iotId}, {descp: "true"}):
    TopicServices.Lamp.updateDscp({iotId: req.user.iotId}, {descp: "false"})*/

    
}

/**
 * @openapi
 *  /sensors/led/status:
 *  post:
 *      tags:
 *          - modules
 *      description: turn led light on/off
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              example: true/false
 * 
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      "": ""
 *          401:
 *              description: Invalid token
 */ 
async function setLed(req, res, next) {
    ledModule = TopicServices.Led.getMine(req.user.sub); // token
    mqttHandler.sendLedStatus(req.body.status) // String : true/false 
    console.log("updated Led : " + JSON.stringify(req.body));
    res.sendStatus(200);
}

/**
 * @openapi
 *  /sensors/{module}:
 *  get:
 *      tags:
 *          - modules
 *      description: get module value of an user, related to its token
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *      parameters:
 *          - name: module
 *            description: "led/luminosity/lamp/temperature/humidity"
 *            required: true
 *            in: path
 *            type: string
 *
 *      responses:
 *          200:
 *              description: get specified module value from token
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/moduleValue'
 *          401:
 *              description: Invalid token
 */
function getModuleValue(req, res, next) {
    topic = getTopic(req.params.module);
    console.log("topic = " + topic)
    TopicServices[topic].findByUser(req.user.sub).then((values, err) => {
        console.log("values = " + values);
        res.send({
            module: values.name,
            value: values.value,
            lastUpdate: values.lastUpdate
        });
    });
}

async function setOrCreateModules(topic, userId, iotId) {
    tmpModule = await TopicServices[topic].findByUser(userId);
    if (tmpModule == null) {
        TopicServices[topic].create(
            {userId:userId, iotId: iotId},
        ).then((value, err) => {
            if (err)
                return false;
            return true;
        });
    } else {
        TopicServices[topic].updateIotId(
            {userId: userId},
            {iotId: iotId},
        ).then((value, err) => {
            if (err)
                return false;
            return true;
        });
    }
}


/**
 * @openapi
 *  /sensors/id:
 *  post:
 *      tags:
 *          - modules
 *      description: set modules Id, related to its token
 *      produces:
 *          - application/json
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *           - application/json
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          iotId:
 *                              type: string
 *                              example: "WhateverTheString"
 *      responses:
 *          200:
 *              description: get specified module value from token
 *              content:
 *                  application/json:
 *                      "": ""
 *          401:
 *              description: Invalid token
 */
async function setIotId(req, res, next) {
    UserService.setIotId(req.user.sub, req.body.iotId).then((user, err) => {
        if (err)
            res.sendStatus(400);
        checkReturn = true;
        for(topic in mqttTopics) {
            setOrCreateModules(getTopic(topic), user._id, user.iotId);
        }
        res.sendStatus(200);
    });
}

function getTopic(topic) {
    returnTopic = mqttTopics[topic];
    returnTopic = returnTopic[0].toUpperCase() + returnTopic.slice(1);
    return returnTopic;
}