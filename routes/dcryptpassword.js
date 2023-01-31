const express = require('express')
const router = express.Router()

const { dcryptPassword } = require('../controller/dcryptpasswordController')
const { requireAuth } = require('../middleware/requireAuth')

// GET all users
router.post('/', requireAuth, dcryptPassword)

module.exports = router