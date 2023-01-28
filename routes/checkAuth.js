const express = require('express')
const router = express.Router()
const Post = require('../model/postModel')
const mongoose = require('mongoose')
const { requireAuth } = require('../middleware/requireAuth')
const {
  canModifyPost } = require('../permissions/posts')

// CHECK AUTH
router.get('/:id', setPost, requireAuth, authModifyPost, (req, res) => {
  res.json({ msg: 'Authorized' })
})

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

function authModifyPost(req, res, next) {
  if (!canModifyPost(req.user, req.post)) {
    res.status(401)
    return res.json({ error: 'You are not allow to edit this post!' })
  }

  next()
}

module.exports = router