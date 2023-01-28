const User = require('../model/userModel')

const setUser = (req, res, next) => {
  const userId = req.body.userId

  if (userId) {
    req.user = User.find(u => u._id === userId)
  }
  next()
}

module.exports = setUser