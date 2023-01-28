const jwt = require('jsonwebtoken')
const User = require('../model/userModel')
const createError = require('../utils/error')

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) return next(createError(401, 'You are not authenticated!'))

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return next(createError(403, 'Token is not valid!'))
    req.user1 = user.UserInfo
    next()
  })
}

// check if user is signed in and verify token
const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.split(' ')[1]

  try {
    const { UserInfo } = jwt.verify(token, process.env.SECRET)

    // attact user property to req object
    // select only id and role
    req.user = await User.findOne({ _id: UserInfo._id }).select('_id role')
    next()
  } catch (error) {
    // Token expired also catch here
    res.status(401).json({ error: error })
  }
}

// check if user is allow
function authRole(role) {
  return (req, res, next) => {
    if (req.user.role.toLowerCase() !== role) {
      res.status(401)
      return res.json({ error: 'Not allowed!' })
    }

    next()
  }
}

module.exports = { verifyToken, requireAuth, authRole }