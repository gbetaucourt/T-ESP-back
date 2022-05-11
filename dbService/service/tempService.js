const dbService = require('../../_helpers/db').Temperature;

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
	updateModule: updateWithIotId
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

async function updateWithUser(userId, value, lastUpdate) {
	return await dbService.findOneAndUpdate(userId, value, lastUpdate)
}

async function updateWithIotId(IotId, value, lastUpdate) {
	return await dbService.findOneAndUpdate(IotId, value, lastUpdate)
}

async function updateIotId(userId, iotId) {
	return await dbService.findOneAndUpdate(userId, iotId);
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
