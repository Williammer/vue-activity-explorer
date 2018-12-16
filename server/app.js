'use strict'

const fs = require('fs')
const yaml = require('js-yaml')
const serveStatic = require('serve-static')
const path = require('path')
const fastify = require('fastify')({ logger: true })

const { getModels, initModels } = require('./models/index')
const router = require('./router/index')
const startServer = () => {
  const config = yaml.safeLoad(fs.readFileSync('./config.yml'))

  // Parse token
  fastify.use('/', (req, res, next) => {
    const token = req.headers['x-blackcat-token']
    const uid = _pangolier.token.getUid(token)

    req.userStatus = { token, uid, isAuthed: Boolean(uid) }
    next()
  })

  // Allow Cross Origin
  fastify.use('/', (req, res, next) => {
    const origin = req.headers['origin']
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, X-BLACKCAT-TOKEN')
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')

    next()
  })

  // For test
  fastify.use('/test', serveStatic(path.join(__dirname, '/test')))

  fastify.register(router, { prefix: '/api/v1' })

  fastify.listen(config.port, err => {
    if (err) {
      console.log('err', err)
      fastify.log.error(err)
      process.exit(1)
    }
  })
}

global._pangolier = {
  getModels: getModels,
  token: require('./helper/token'),
  utils: require('./helper/utils')
}

initModels()
  .then(startServer)
