const Category = require('../model/categoryModel')
const mongoose = require('mongoose')

// GET All Category
const getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: 1 })

  if (!categories) {
    res.status(404).json({ msg: 'no cat' })
  } else {
    res.status(200).json(categories)
  }
}

// CREATE Category
const creatCategory = async (req, res) => {
  const { catName } = req.body

  if (!catName) {
    return res.status(400).json({ error: 'បញ្ជូលប្រភេទអត្ថបទថ្មី!' })
  }

  try {
    const newCat = await Category.create({ catName })
    res.status(200).json(newCat)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// UPDATE category
const updateCategory = async (req, res) => {
  const { id } = req.params
  const { catName } = req.body

  if (!catName) {
    return res.status(400).json({ error: 'បញ្ជូលប្រភេទអត្ថបទ!' })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout from mongoose' })
  }

  const updatedCat = await Category.findOneAndUpdate({ _id: id }, { catName }, { new: true })

  if (!updatedCat) {
    return res.status(400).json({ error: 'No such category' })
  }

  // will send old unedit data if don't use {new: true} (mongoose)
  res.status(200).json(updatedCat)
}

// DELETE Category
const deleteCategory = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout from mongoose' })
  }

  const deletedCat = await Category.findOneAndDelete({ _id: id })

  if (!deletedCat) {
    return res.status(400).json({ error: 'no such category!' })
  }

  res.status(200).json(deletedCat)
}

module.exports = {
  getCategories,
  creatCategory,
  updateCategory,
  deleteCategory
}