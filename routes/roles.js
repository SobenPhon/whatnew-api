const express = require('express')
const router = express.Router()
const Role = require('../model/roleModel')
const mongoose = require('mongoose')
const { requireAuth } = require('../middleware/requireAuth')
const { getRoles, createRole, updateRole, deleteRole } = require('../controller/roleController')
const { canEditRole, canDeleteRole } = require('../permissions/roles')

router.use(requireAuth)

// GET All Roles
router.get('/', getRoles)

// CREATE Role
router.post('/', createRole)

// UPDATE Role
router.patch('/:roleId', authEditRole, updateRole)

// DELETE Role
router.delete('/:roleId', authDeleteRole, deleteRole)

function authEditRole(req, res, next) {
  if (!canEditRole(req.user, req.foundRole)) {
    res.status(401)
    return res.json({ error: 'You are not allow to edit this role!' })
  }

  next()
}

function authDeleteRole(req, res, next) {
  if (!canDeleteRole(req.user, req.foundRole)) {
    res.status(401)
    return res.json({ error: 'You are not allow to delete this role!' })
  }

  next()
}

module.exports = router