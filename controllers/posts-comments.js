const Router = require('koa-router')
const passport = require('koa-passport')

const Comment = require('../models/Comment')

const router = new Router().prefix('/posts/:postId/comments')

router.get('/', async (ctx) => {
  const postId = ctx.params.postId
  const comments = await Comment
    .find({ postId, parenId: {"$exists": false} })
    .sort({ createdDate: -1 })
  ctx.body = comments
})

router.get('/:commentId', async (ctx) => {
  const comment = await Comment.findById(ctx.params.commentId)
  if (comment) {
    ctx.body = comment
  } else {
    ctx.throw(404)
  }
})

router.post('/', passport.authenticate('jwt', { session: false }), async (ctx) => {
  const postId = ctx.params.postId
  const { parentId, body } = ctx.request.body
  const user = ctx.state.user._id

  const comment = await new Comment({ postId, parentId, body, user }).save()
  ctx.body = { message: 'Comment added successfully!', comment: { ...comment._doc } }
  ctx.status = 201
})

module.exports = router.routes()
