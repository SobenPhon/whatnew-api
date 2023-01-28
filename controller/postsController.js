const Post = require('../model/postModel')
const mongoose = require('mongoose')

// GET all posts
const getPosts = async (req, res) => {
  res.status(200).json(res.paginatedResults)
}

// GET Auth posts
const getAuthPosts = async (req, res) => {
  res.status(200).json(res.paginatedResults)
}

// GET all posts by category
const getPostsByCat = async (req, res) => {
  res.status(200).json(res.paginatedResults)
}

// GET Single Post
const getPost = async (req, res) => {
  res.status(200).json(req.post)
}

// CREATE Post
const createPost = async (req, res) => {
  const { title, description, author, category, image, user_id } = req.body
  const emptyFields = []

  if (!title) {
    emptyFields.push('title')
    return res.status(400).json({ error: 'Enter title!' })
  }
  if (!description) {
    emptyFields.push('description')
    return res.status(400).json({ error: 'Enter description!' })
  }
  if (!author) {
    emptyFields.push('author')
    return res.status(400).json({ error: 'Enter author!' })
  }
  if (category.length < 1) {
    emptyFields.push('category')
    return res.status(400).json({ error: 'Enter category!' })
  }
  if (!image) {
    emptyFields.push('image')
  }
  if (!user_id) {
    emptyFields.push('user_id')
    return res.status(400).json({ error: 'Enter author!' })
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields' })
  }

  try {
    // const loged_user_id = req.user._id
    const post = await Post.create({ title, description, author, category, image, user_id: user_id })
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// UPDATE Post
const updatePost = async (req, res) => {
  const { id } = req.params
  const { title, description, author, category, image, user_id } = req.body

  const emptyFields = []

  if (!title) {
    emptyFields.push('title')
    return res.status(400).json({ error: 'empty title!' })
  }
  if (!description) {
    emptyFields.push('description')
    return res.status(400).json({ error: 'empty desc!' })
  }
  if (!author) {
    emptyFields.push('author')
    return res.status(400).json({ error: 'empty author!' })
  }
  if (!category) {
    emptyFields.push('category')
    return res.status(400).json({ error: 'empty category!' })
  }
  if (!user_id) {
    emptyFields.push('authorid')
    return res.status(400).json({ error: 'empty author id!' })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout from mongoose' })
  }

  const post = await Post.findOneAndUpdate({ _id: id }, {
    title, description, author, category, image, user_id
  }, { new: true })

  if (!post) {
    return res.status(400).json({ error: 'No such post' })
  }

  // will send old unedit data if don't use {new: true} (mongoose)
  res.status(200).json(post)
}

// DELETE Post
const deletePost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout from mongoose' })
  }

  const post = await Post.findOneAndDelete({ _id: id })

  if (!post) {
    return res.status(400).json({ error: 'no such post!' })
  }

  res.status(200).json(post)
}

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostsByCat,
  getAuthPosts
}