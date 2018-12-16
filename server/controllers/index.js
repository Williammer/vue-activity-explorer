'use strict'

module.exports = models => {
  return {
    authController: (require('./auth.js')),
    channelController: (require('./channel.js')),
    eventController: (require('./event.js')),
    userController: (require('./user.js'))
  }
}
