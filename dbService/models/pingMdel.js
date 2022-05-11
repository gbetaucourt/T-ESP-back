const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectID, required: true },
    lastUpdate: { type: String, required: false}
});

schema.set('toJson', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, rec) {
        delete ret_.id;
    }
})

module.exports = mongoose.model('ping', schema);