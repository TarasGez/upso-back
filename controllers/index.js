const Router = require('koa-router')

const auth = require('./auth')
const posts = require('./posts')
const postsLikes = require('./posts-likes')

const router = new Router().prefix('/api')

router.use(auth, posts, postsLikes)

module.exports = router