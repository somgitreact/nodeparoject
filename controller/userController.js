const User = require('../model/userModel');
const catchBlock = require('../utils/catchBlock');
const {updateData, showAll, oneData, deleteOne} = require('../utils/actionCreator')





exports.editUser = updateData(User, 400)
exports.allUser = showAll(User, 400)
exports.oneUser = oneData(User, 400)
exports.deleteUser = deleteOne(User, 400)