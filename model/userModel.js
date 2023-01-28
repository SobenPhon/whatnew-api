const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    required: true
  }
}, { timestamps: true })

// static signup method
userSchema.statics.signup = async function (firstName, lastName, username, email, password, role, profile) {
  // validation
  if (!firstName || !lastName || !username || !email || !password || !role || !profile) {
    throw Error('All fields must be filled')
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }

  // if (!validator.isStrongPassword(password)) {
  //   throw Error('Password not strong enough')
  // }

  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Email already in use')
  }

  // password encryption
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ firstName, lastName, username, email, password: hash, role, profile })

  return user
}

// static login method
userSchema.statics.login = async function (email, password) {
  // validation , email or username
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }

  const user = await this.findOne({ email })

  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  // const match = password === user.password

  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}


module.exports = mongoose.model('User', userSchema)