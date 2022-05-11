const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectID, required: true },
    name: { type: String, required: false},
    descp: { type: String, required: false},
    value: { type: String, required: false},
    iotId: { type: Schema.Types.String, ref:'User'},
    lastUpdate: { type: String, required: false}
});

schema.set('toJson', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, rec) {
        delete ret_.id;
    }
})

module.exports = mongoose.model('luminosity', schema);