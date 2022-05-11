const User = require('db').User

module.exports = {
    isAdmin: (id) => {
        const user  = await User.findOne({userid: id, userLevel: 1});
        if (!user) return false
        else return true
    }
}