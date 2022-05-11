const express = require('express');
const router = express.Router();
const userService = require('./../dbService/service/userService');
const TopicServices = require('./../dbService/dbServiceHandler');


// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/update', update);
router.delete('/:id', _delete);

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
 *  /users/authenticate:
 *  post:
 *      tags:
 *          - user
 *      description: Authenticate a user
 *      produces:
 *          - application/json
 *      security: []
 *      consumes:
 *           - application/json
 *      requestBody:
 *          description: "- UNIQUE: email, iotId"
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              example: tata
 *                              required: true
 *                          password:
 *                              type: string
 *                              example: titi
 *                              required: true
 *      responses:
 *          200:
 *              description: return User with token
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/user'
 *                      
 */
function authenticate(req, res, next) {
    console.log("req.body = " + JSON.stringify(req.body));
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}

/**
 * @openapi
 *  /users/register:
 *  post:
 *      tags:
 *          - user
 *      description: "register a new user"
 *      security: []
 *      produces:
 *          - application/json
 *      consumes:
 *           - application/json
 *      requestBody:
 *          description: "- Required: email, password /\n- UNIQUE: email, iotId"
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/user'
 *
 *      responses:
 *          200:
 *              description: register an user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/user'
 *          400:
 *              description: Email already taken
 */
function register(req, res, next) {
    userService.create(req.body)
        .then((user) => {
            res.send(user)
            userService.getUserByIotId(req.body.iotId).then((user, err) => {
                for(topic in mqttTopics) {
                    console.log('bite');
                    setOrCreateModules(getTopic(topic), user._id, user.iotId);
                }
            });
        })
        .catch(err => next(err));
    
    
}

/**
 * @openapi
 *  /users/:
 *  get:
 *      tags:
 *          - user
 *      description: get all users
 *      produces:
 *          - application/json
 *      consumes:
 *           - application/json
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: return all Users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/user'
 *          401:
 *              description: Invalid token
 */
function getAll(req, res, next) {
    console.log(req.user)
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}


/**
 * @openapi
 *  /users/current :
 *  get:
 *      tags:
 *          - user
 *      description: get current
 *      produces:
 *          - application/json
 *      consumes:
 *           - application/json
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: return User
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/user'
 *          401:
 *              description: Invalid token
 */
function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @openapi
 *  /users/{id} :
 *  get:
 *      tags:
 *          - user
 *      description: get user by its Id
 *      produces:
 *          - application/json
 *      consumes:
 *           - application/json
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            required: true
 *            in: path
 *            type: string
 * 
 *      responses:
 *          200:
 *              description: get specifid user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/user'
 *          401:
 *              description: Invalid token
 */
function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

/**
 * @openapi
 *  /users/update :
 *  put:
 *      tags:
 *          - user
 *      description: Update user related to token
 *      produces:
 *          - application/json
 *      consumes:
 *           - application/json
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/definitions/user'
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      "": ""
 *          401:
 *              description: Invalid token
 */
function update(req, res, next) {
    userService.update(req.user.sub, req.body)
        .then((user, err) => {
            res.json({})
        })
        .catch(err => next(err));
    userService.getUserByIotId(req.body.iotId).then((user, err) => {
        for(topic in mqttTopics) {
            console.log('bite');
            setOrCreateModules(getTopic(topic), user._id, user.iotId);
        }
    });
    
    
}

function getTopic(topic) {
    returnTopic = mqttTopics[topic];
    returnTopic = returnTopic[0].toUpperCase() + returnTopic.slice(1);
    return returnTopic;
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



function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.status(200).json({message: 'User has been deleted'}))
        .catch(err => next(err));
}
