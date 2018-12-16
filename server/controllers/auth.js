'use strict'

const md5 = require('md5')

const encrypte = (password, salt) => md5(`${password}${salt}`).slice(0, 32)
const makeSalt = () =>
  Math.ceil(Math.random() * Math.pow(10, 16)).toString() +
  Math.ceil(Math.random() * Math.pow(10, 16)).toString()

const { send400, send403, send404 } = _pangolier.utils

const { User } = _pangolier.getModels()

const register = async (request, reply) => {
  const { username, password, email, avatar } = request.body || {}

  if (!username || !password || !email || !avatar) {
    return send400(reply, 'error_missing_param')
  }

  const exist = await User.findOne({
    where: { username }
  })

  if (exist !== null) {
    return send403(reply, 'error_username_exist')
  }

  const salt = makeSalt()

  const user = await User.create({
    username,
    salt,
    password: encrypte(password, salt),
    avatar,
    email
  })

  reply
    .send({
      token: _pangolier.token.makeToken(user.dataValues.id),
      userId: user.dataValues.id
    })
}

const auth = async (request, reply) => {
  const { username, password } = request.body || {}

  if (!username || !password) {
    return send400(reply, 'error_missing_param')
  }

  const user = await User.findOne({
    where: { username }
  })

  if (user === null) {
    return send404(reply, 'error_user_not_found')
  }

  if (
    user.dataValues.password ===
    encrypte(password, user.dataValues.salt)
  ) {
    const token = _pangolier.token.makeToken(user.dataValues.id)
    const { id, username, email, avatar } = user.dataValues

    return reply
      .send({
        token,
        user: { id, username, email, avatar }
      })
  }
  send403(reply, 'error_password')
}

const unauth = async (request, reply) => {
  const { isAuthed, token } = request.req.userStatus

  if (isAuthed) {
    _pangolier.token.deleteToken(token)
    request.req.userStatus = { isAuthed: false }

    return reply.send()
  }

  return send403(reply, 'invalid_token')
}

module.exports = {
  register,
  auth,
  unauth
}
