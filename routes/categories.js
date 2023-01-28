const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/requireAuth')
const {
  getCategories,
  creatCategory,
  updateCategory,
  deleteCategory
} = require('../controller/categoryController')

// GET All Category
router.get('/', getCategories)

// CREATE Category
router.post('/', requireAuth, creatCategory)

// UPDATE Category
router.patch('/:id', requireAuth, updateCategory)

// DELETE Category
router.delete('/:id', requireAuth, deleteCategory)

module.exports = router