const { ROLE } = require('../data')

function canDecrypt(logedUser, foundUser) {
  return (
    (logedUser.role.toLowerCase() === ROLE.ADMIN) || (foundUser._id.toString() === logedUser._id.toString())
  )
}

module.exports = canDecrypt