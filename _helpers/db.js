const config = require('./../config.json');
const mongoose = require('mongoose');

const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
const constants = require("../env.js");

mongoose.connect(/*"mongodb://localhost:27017/Dhomotic", connectionOptions, (err) => {*/"mongodb+srv://"+constants.mongoUser+":"+constants.mongoPassword+"@cluster0.sc0ac.mongodb.net/"+constants.mongoDatabase+"?retryWrites=true&w=majority", connectionOptions, (err) => {
    if (err){
        console.log(err)
    }
    console.log("connected");
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('./../dbService/models/userModel'),
    Led: require('./../dbService/models/ledModel'),
    Luminosity: require('./../dbService/models/luminModel'),
    Temperature: require('./../dbService/models/tempModel'),
    Ping: require('./../dbService/models/pingMdel'),
    Lamp: require('./../dbService/models/lampModel'),
    Humidity: require('./../dbService/models/humidity'),
};
