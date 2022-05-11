const dbService = require('../../_helpers/db').Lamp;

module.exports = {
	create: create,
	getAll: getAll,
	getMine: getMine,
	getById: getById,
	update: update,
	delete: _delete,
    updateWithUser: updateWithUser,
    findByUser: findByUser,
	updateIotId: updateIotId,
	findByIotId: findByIotId,
	updateModule: updateWithIotId,
	updateDscp: updateDscp
}

async function create(params){
	var l = new dbService(params)
	l.save()
	return l
}

async function getAll() {
	return await dbService.find()
}

async function getById(id){
	return await dbService.findById(id)
}

async function getMine(userid) {
	return await dbService.find({userId: userid})
}

async function update(id, query) {
	return await dbService.findOneAndUpdate(id, query)
}

async function updateDscp(iotId, dscp) {
	dbService.findOneAndUpdate(iotId, dscp).then((value, err) => {
		console.log("VALUE = " + value);
		console.log("ERROR = " + err);
	});
}

async function updateWithUser(userId, value, lastUpdate) {
	return await dbService.findOneAndUpdate(userId, value, lastUpdate)
}

async function updateWithIotId(IotId, value, lastUpdate) {
	console.log("update iot: " + JSON.stringify(value) + " " + JSON.stringify(lastUpdate));
	return await dbService.findOneAndUpdate(IotId, value, lastUpdate)
}

async function updateIotId(userId, iotId) {
	console.log("update iot: " + JSON.stringify(userId) + " " + JSON.stringify(iotId));
	return await dbService.findOneAndUpdate({userId: userId.userId}, {iotId: iotId.iotId});
}

async function findByUser(userId) {
    const id = {"userId": userId};
    return await dbService.findOne(id);
}

async function findByIotId(iotId) {
	return await dbService.findOne({iotId: iotId});
}

async function _delete(id){
	return await dbService.findByIdAndRemove(id)
}
