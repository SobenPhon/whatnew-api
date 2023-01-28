const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const User = require('../model/userModel')

const {
  getUsers,
  getUsersPost,
  getUser,
  loginUser,
  signupUser,
  updateUser,
  deleteUser
} = require('../controller/userController')
const { requireAuth, verifyToken } = require('../middleware/requireAuth')
const { canEditUser, canDeleteUser } = require('../permissions/users')

// require auth for all user
// router.use(requireAuth)

// GET all users
router.get('/', requireAuth, getUsers)

// GET all users (add new post)
router.get('/view', requireAuth, getUsersPost)

// GET single user
router.get('/:id', requireAuth, getUser)

// LOGIN route
router.post('/login', loginUser)

// SIGNUP route
// router.post('/signup', verifyToken, signupUser)
router.post('/signup', signupUser)

// UPDATE route
router.patch('/:id', setUser, requireAuth, authEditUser, updateUser)

// DELETE route
router.delete('/:id', setUser, requireAuth, authDeleteUser, deleteUser)

async function setUser(req, res, next) {
  const userId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).json({ error: 'No such user from mongoose' })
  }

  req.foundUser = await User.findById(userId)

  if (req.foundUser == null) {
    res.status(404)
    return res.json({ error: 'User not found!' })
  }
  next()
}

function authEditUser(req, res, next) {
  if (!canEditUser(req.user, req.foundUser)) {
    res.status(401)
    return res.json({ error: 'You are not allow to edit this user!' })
  }

  next()
}

function authDeleteUser(req, res, next) {
  if (!canDeleteUser(req.user, req.foundUser)) {
    res.status(401)
    return res.json({ error: 'Unauthorized to delete!' })
  }

  next()
}

module.exports = router