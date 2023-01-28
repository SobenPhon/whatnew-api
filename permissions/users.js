const { ROLE } = require('../data')

function canViewUser(logedUser, foundUser) {
  return (
    (logedUser.role.toLowerCase() === ROLE.ADMIN) || (foundUser._id.toString() === logedUser._id.toString())
  )
}

function scopedUser(loggedUser, usersList) {
  if (loggedUser.role.toLowerCase() === ROLE.ADMIN) return usersList
  return usersList.filter(user => user._id.toString() === loggedUser._id.toString())
}

function scopedUserPost(loggedUser, usersList) {
  if (loggedUser.role.toLowerCase() === ROLE.ADMIN) return usersList
  if (loggedUser.role.toLowerCase() === ROLE.EDITOR) {
    return usersList.filter(user => user.role.toLowerCase() !== ROLE.ADMIN)
  }
  return usersList.filter(user => user._id.toString() === loggedUser._id.toString())
}

function canEditUser(logedUser, foundUser) {
  return (
    (logedUser.role.toLowerCase() === ROLE.ADMIN) || (foundUser._id.toString() === logedUser._id.toString())
  )
}

function canDeleteUser(logedUser) {
  return (
    (logedUser.role.toLowerCase() === ROLE.ADMIN)
  )
}

module.exports = {
  canViewUser,
  canEditUser,
  canDeleteUser,
  scopedUser,
  scopedUserPost
}