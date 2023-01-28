const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../model/postModel')

const { requireAuth } = require('../middleware/requireAuth')

const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost
} = require('../controller/postsController')

const {
  canViewPost,
  canEditPost,
  canDeletePost } = require('../permissions/posts')

// require auth for all post routes
// router.use(requireAuth)

// GET all posts
router.get('/', paginatedResults(Post), getPosts)

// GET single post
router.get('/:id', setPost, getPost)

// CREATE posts
router.post('/', requireAuth, createPost)

// UPDATE post
router.patch('/:id', setPost, requireAuth, authEditPost, updatePost)

// DELETE post
router.delete('/:id', setPost, requireAuth, authDeletePost, deletePost)

async function setPost(req, res, next) {
  const postId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({ error: 'No such post from mongoose' })
  }
  req.post = await Post.findById(postId)

  if (req.post == null) {
    res.status(404)
    return res.json({ error: 'Post not found!' })
  }
  next()
}

function authEditPost(req, res, next) {
  if (!canEditPost(req.user, req.post, req)) {
    res.status(401)
    return res.json({ error: 'You are not allow to edit this post!' })
  }

  next()
}

function authDeletePost(req, res, next) {
  if (!canDeletePost(req.user, req.post)) {
    res.status(401)
    return res.json({ error: 'Not Allowed to Delete' })
  }

  next()
}

function authGetPost(req, res, next) {
  if (!canViewPost(req.user, req.post)) {
    res.status(401)
    return res.json({ error: 'Not Allowed' })
  }

  next()
}

function paginatedResults(model) {
  return async (req, res, next) => {
    const cat = req.query.cat || ""
    const author = req.query.author || ""
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    let q = req.query.q

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    results.posts = await model.countDocuments().exec()

    const sortByDate = { createdAt: -1 }
    try {
      if (cat && author) {
        results.total = await model.countDocuments({
          "$and": [
            { category: cat },
            { author: author }
          ]
        })
        results.results = await model.find({
          "$and": [
            { category: cat },
            { author: author }
          ]
        }).sort(sortByDate).limit(limit).skip(startIndex).exec()
      } else if (cat) {
        results.total = await model.countDocuments({ category: cat })
        results.results = await model.find({ category: cat }).sort(sortByDate).limit(limit).skip(startIndex).exec()
      } else if (author) {
        results.total = await model.countDocuments({ author: author })
        results.results = await model.find({ author: author }).sort(sortByDate).limit(limit).skip(startIndex).exec()
      } else {
        results.total = await model.countDocuments({
          "$or": [
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        })
        results.results = await model.find({
          "$or": [
            { title: { $regex: q, $options: 'i' } },
            { author: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }).sort(sortByDate).limit(limit).skip(startIndex).exec()
      }

      res.paginatedResults = results
      next()
    } catch (err) {
      next(err)
      // res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = router