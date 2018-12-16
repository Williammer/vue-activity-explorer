'use strict'

const routes = async fastify => {
  const { models } = _pangolier
  const controllers = (require('../controllers/index.js'))(models)
  const {
    authController,
    eventController,
    channelController,
    userController
  } = controllers

  fastify.options('/*', async (request, reply) => reply.send())

  // Auth
  fastify.post('/join', authController.register)
  fastify.post('/auth/token', authController.auth)
  fastify.delete('/auth/token', authController.unauth)

  // Channel
  fastify.get('/channels', channelController.getChannels)

  // Event
  fastify.get('/events', eventController.getEventsByQuery)
  fastify.get('/events/:eventId', eventController.getEventById)

  fastify.get('/events/:eventId/participants', eventController.getEventParticipants)
  fastify.post('/events/:eventId/participants', eventController.participateEvent)
  fastify.delete('/events/:eventId/participants', eventController.leaveEvent)

  fastify.get('/events/:eventId/likes', eventController.getEventLiker)
  fastify.post('/events/:eventId/likes', eventController.likeEvent)
  fastify.delete('/events/:eventId/likes', eventController.unlikeEvent)

  fastify.get('/events/:eventId/comments', eventController.getComments)
  fastify.post('/events/:eventId/comments', eventController.commentEvent)

  // User
  fastify.get('/user', userController.getUserInfo)
  fastify.get('/user/events', userController.getUserEvents)
}

module.exports = routes
