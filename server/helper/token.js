'use strict'

const md5 = require('md5')

const store = {}

module.exports = {
  makeToken: uid => {
    const token = md5(Date.now())

    store[token] = uid

    return token
  },
  getUid: token => token && store[token],
  deleteToken: token => {
    return token && delete store[token]
  }
}
