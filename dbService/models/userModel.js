const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

var validateZipCode = (zipcode) => {
    var re = /^\d{5}(?:[-\s]\d{4})?$/
    return re.test(zipcode)
}


const schema = new Schema({
    username: { type: String },
    hash: { type: String, required: true },
    firstName: { type: String},
    lastName: { type: String},
    language: {type: String},
    zipcode: {type: String, required: false, validate: [validateZipCode, 'Please fill a valid zipcode']},
    email: { type: String, required: true, validate: [validateEmail, 'Please fill a valid email address'], unique: true},
    createdDate: { type: Date, default: Date.now },
    iotId: { type: String, unique: true},
    userLevel: {type: Number, default: 0}
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);