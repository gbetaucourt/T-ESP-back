const dbService = require('../../_helpers/db').Led;

module.exports = {
	create: create,
	getAll: getAll,
	getMine: getMine,
	getById: getById,
	update: update,
	delete: _delete,
    updateWithUser: updateWithUser,
    findByUser: findByUser
}

async function create(params){
	var p = new dbService(params)
	p.save()
	return p
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

async function updateWithUser(userId, lastUpdate) {
	return await dbService.findOneAndUpdate(userId, lastUpdate, (err, obj) => {
        if (err)
            console.log("ERROR" + err);
    })
}

async function findByUser(userId) {
    const id = {"userId": userId};
    return await dbService.findOne(id);
}

async function _delete(id){
	return await dbService.findByIdAndRemove(id)
}
