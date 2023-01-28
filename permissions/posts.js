const { ROLE } = require('../data')

function canViewPost(user, post) {
  return (
    (user.role.toLowerCase() === ROLE.ADMIN) || (post.user_id === user._id.toString())
  )
}

function scopedPosts(user, posts) {
  console.log(user._id.toString())
  if (user.role.toLowerCase() === ROLE.ADMIN) return posts
  const filterPost = posts.results.filter(post => {
    if (post.user_id === user._id.toString()) {
      console.log(true)
      return post
    }
  })
  return filterPost
}

function canEditPost(user, post) {
  return (
    (user.role.toLowerCase() === ROLE.ADMIN) || (user.role.toLowerCase() === ROLE.EDITOR) || (post.user_id === user._id.toString())
  )
}

function canDeletePost(user, post) {
  return (
    (user.role.toLowerCase() === ROLE.ADMIN) || (user.role.toLowerCase() === ROLE.EDITOR) || (post.user_id === user._id.toString())
  )
}

function canModifyPost(user, post) {
  return (
    (user.role.toLowerCase() === ROLE.ADMIN) || (user.role.toLowerCase() === ROLE.EDITOR) || (post.user_id === user._id.toString())
  )
}

module.exports = {
  canViewPost,
  canEditPost,
  canDeletePost,
  scopedPosts,
  canModifyPost
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    