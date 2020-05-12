const Router = require('koa-router')
const passport = require('koa-passport')

const Post = require('../models/Post')

const router = new Router().prefix('/posts')

router.post('/', passport.authenticate('jwt', { session: false }), async (ctx) => {
  const { title, body } = ctx.request.body
  const user = ctx.state.user._id
  const post = await new Post({ title, body, user }).save()
  ctx.body = { message: 'Post created successfully!', ...post._doc }
  ctx.status = 201
})

router.get('/', async (ctx) => {
  const { query } = ctx
  const { skip, limit } = query
  delete query.skip
  delete query.limit
  const q = 'users' in query ?
    { user: { $in: query.users.split(',') } } : query
  let total = 0  
  total = await Post.countDocuments(q)
  const posts = await Post
    .find(q)
    .sort({ createdDate: -1 })
    .skip(+skip)
    .limit(+limit)
  ctx.body = {
    'posts': posts,
    'total': total
  }
})

router.get('/:id', async (ctx) => {
  const post = await Post.findById(ctx.params.id)
  if (post) {
    ctx.body = post
  } else {
    ctx.throw(404, 'Post has not been found')
  }
})

router.put('/', passport.authenticate('jwt', { session: false }), async (ctx) => {
  const { _id, title, body } = ctx.request.body
  const user = ctx.state.user._id
  const post = await Post.findOneAndUpdate(
    { _id, user },
    { $set: { title, body } },
    { new: true }
  )
  ctx.body = { message: 'Post successfully updates!', ...post._doc }
})

router.delete('/:_id', passport.authenticate('jwt', { session: false }), async (ctx) => {
  await Post.findOneAndRemove({
    _id: ctx.params._id,
    user: ctx.state.user._id
  })
  ctx.body = { message: 'Post has been deleted' }
})

module.exports = router.routes()
