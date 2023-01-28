const Role = require('../model/roleModel')
const mongoose = require('mongoose')
const { scopedRole } = require('../permissions/roles')

// GET all roles
const getRoles = async (req, res) => {
  const roles = await Role.find({}).sort({ createdAt: 1 })

  if (!roles) {
    res.status(404).json({ msg: 'There is no role!' })
  } else {
    res.status(200).json(scopedRole(req.user, roles))
  }
}

// CREATE Role
const createRole = async (req, res) => {
  const { role } = req.body
  console.log(role)

  if (!role) {
    return res.status(400).json({ error: 'Enter role!' })
  }

  try {
    const createdRole = await Role.create({ role })
    res.status(201).json(createdRole)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// UPDATE Role
const updateRole = async (req, res) => {
  const { roleId } = req.params
  const { role } = req.body

  if (!role) {
    return res.status(400).json({ error: 'Empty role!' })
  }

  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(404).json({ error: 'No such role (taped with params)' })
  }

  const updatedRole = await Role.findOneAndUpdate({ _id: roleId }, {
    role
  }, { new: true })
  // will send old unedit data if don't use {new: true} (mongoose)

  if (!updatedRole) {
    return res.status(400).json({ error: 'No such role' })
  }

  res.status(200).json(updatedRole)
}

// DELETE Role
const deleteRole = async (req, res) => {
  const { roleId } = req.params

  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(404).json({ error: 'No such role (taped with params)' })
  }

  const deletedRole = await Role.findOneAndDelete({ _id: roleId })

  if (!deletedRole) {
    return res.status(400).json({ error: 'no such role!' })
  }

  res.status(200).json(deletedRole)
}

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole
}