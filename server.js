require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const https = require('https')
var morgan = require('morgan')
const mqtt = require('./mqtt/webSockets')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Dhomotic API",
        version: "1.0.0",
        description: "A simple Express Library API"
      },
      servers: [
        {
          url: "http://localhost:4000/"
        }
      ],
      components: {
        securitySchemes:{
            bearerAuth:{
                name: 'Authorization',
                type: "http",
                in: 'header',
                scheme: "bearer",
                bearerFormat: "jwt",
                value: "bearer <jwt>"
            }
        }
    },
    security: [
        { bearerAuth: [] }
      ],
    },
    apis: [
        "./controllers/*.js",
        "./swagger/*.js"
    ],
    basePath: '/',
    
};
const swaggerUiOptions = {
  swaggerOptions: {
    basicAuth: {
      name:   'Authorization',
      schema: {
        type: 'bearer',
        in:   'header'
      },
      value:  'Bearer <user:password>'
    }
  }
}
  const swaggerSpec = swaggerJsdoc(options);

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

//app.use(express.json());

// use JWT auth to secure the api
app.use(jwt());


// api routes
app.use('/users', require('./controllers/usersController'));
app.use('/sensors', require('./controllers/modules'));
app.use('/ping', require('./controllers/ping'));

// global error handler
app.use(errorHandler);


// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

app.use(morgan);
mqtt.setup();

//module.exports = app;
