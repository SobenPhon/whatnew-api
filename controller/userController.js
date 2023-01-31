const User = require('../model/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { scopedUser, scopedUserPost } = require('../permissions/users')
const createError = require('../utils/error')
const bcrypt = require('bcrypt')
const CryptoJS = require('crypto-js')

const createToken = (_id, role) => {
  return jwt.sign({
    'UserInfo': {
      '_id': _id,
      'role': role
    }
  }, process.env.SECRET, { expiresIn: '3d' })
}

// GET All Users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: 1 })
    // Only admin can see all users
    res.status(200).json(scopedUser(req.user, users))
  } catch (error) {
    // res.status(404).json({ error: error.message })
    next(error)
  }
}

// GET All Users (Add new post)
const getUsersPost = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: 1 })
    res.status(200).json(scopedUserPost(req.user, users))
  } catch (error) {
    next(error)
  }
}

// GET Single User
const getUser = async (req, res) => {
  const { id } = req.params

  // check if id is valid (12 charactor)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such post from mongoose' })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(404).json({ error: 'User not found!' })
  }

  res.status(200).json(user)
}

// LOGIN User
const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id, user.role)

    res.cookie('access_token', token, {
      httpOnly: true
    }).status(200).json({ profile: user.profile, username: user.username, token })

    // res.status(200).json({ profile: user.profile, username: user.username, token })
  } catch (error) {
    next(error)
  }
}

// SIGNUP User
const signupUser = async (req, res, next) => {
  const { firstName, lastName, username, email, password, role, profile } = req.body

  if (!firstName) {
    return res.status(400).json({ error: 'បញ្ជូលត្រកូល' })
  }
  if (!lastName) {
    return res.status(400).json({ error: 'បញ្ជូលនាម' })
  }
  if (!username) {
    return res.status(400).json({ error: 'បញ្ជូលឈ្មោះប្រើប្រាស់' })
  }
  if (!email) {
    return res.status(400).json({ error: 'បញ្ជូលអុីម៉ែល' })
  }
  if (!role) {
    return res.status(400).json({ error: 'បញ្ជូលតួនាទី' })
  }
  if (!profile) {
    return res.status(400).json({ error: 'បញ្ជូលរូបថត' })
  }

  try {
    const user = await User.signup(firstName, lastName, username, email, password, role, profile)

    // create token
    const token = createToken(user._id, user.role)

    res.status(200).json({ profile, username, token })
  } catch (error) {
    next(error)
    // next(createError(500, 'user already exists!'))
  }
}

// UPDATE user
const updateUser = async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, username, email, password, role, profile } = req.body

  if (!firstName) {
    return res.status(400).json({ error: 'បញ្ជូលត្រកូល' })
  }
  if (!lastName) {
    return res.status(400).json({ error: 'បញ្ជូលនាម' })
  }
  if (!username) {
    return res.status(400).json({ error: 'បញ្ជូលឈ្មោះប្រើប្រាស់' })
  }
  if (!email) {
    return res.status(400).json({ error: 'បញ្ជូលអុីម៉ែល' })
  }
  if (!role) {
    return res.status(400).json({ error: 'បញ្ជូលតួនាទី' })
  }
  if (!profile) {
    return res.status(400).json({ error: 'បញ្ជូលរូបថត' })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user from mongoose' })
  }

  // password encryption with bcrypt
  // const salt = await bcrypt.genSalt(10)
  // const hash = await bcrypt.hash(password, salt)

  // password encryption with crypto-js
  const encrypted = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString()

  const updatedUser = await User.findOneAndUpdate({ _id: id }, { firstName, lastName, username, email, password: encrypted, role, profile }, { new: true })

  if (!updatedUser) {
    return res.status(400).json({ error: 'No such user' })
  }

  // will send old unedit data if don't use {new: true} (mongoose)
  res.status(200).json(updatedUser)
}

// DELETE User
const deleteUser = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user from mongoose' })
  }

  const deletedUser = await User.findOneAndDelete({ _id: id })

  if (!deletedUser) {
    return res.status(400).json({ error: 'no such user!' })
  }

  res.status(200).json(deletedUser)
}

module.exports = {
  getUsers,
  getUsersPost,
  getUser,
  loginUser,
  signupUser,
  updateUser,
  deleteUser
}