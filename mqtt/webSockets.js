const receipter = require('./receipt');
const sender = require('./send');

function setup() {
    console.log("setup");
    receipter.listen();
    sender.listen();
}

module.exports = {
    setup: setup
}