const { ROLE } = require('../data')

function scopedRole(loggedUser, roleList) {
  if (loggedUser.role.toLowerCase() === ROLE.ADMIN) return roleList
  return roleList.filter(rol => rol.role.toLowerCase() === loggedUser.role.toLowerCase())
}

function canEditRole(logedUser) {
  return (
    (logedUser.role.toLowerCase() === ROLE.ADMIN)
  )
}

function canDeleteRole(logedUser) {
  return (
    (logedUser.role.toLowerCase() === ROLE.ADMIN)
  )
}

module.exports = {
  scopedRole,
  canEditRole,
  canDeleteRole
}