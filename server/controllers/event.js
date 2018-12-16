'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { send400, send403, send404 } = _pangolier.utils
const {
  User,
  Event,
  Image,
  Like,
  Comment,
  Channel,
  Participation
} = _pangolier.getModels()

const getEventById = async (request, reply) => {
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const eid = request.params.eventId
  const event = await Event.findOne({
    where: { id: eid },
    include: [
      {
        model: Channel,
        as: 'channel'
      },
      {
        model: User,
        as: 'creator'
      },
      {
        model: Like,
        as: 'likes'
      },
      {
        model: Participation,
        as: 'participants'
      }
    ]
  })

  if (event) {
    const images = await Image.findAll({
      where: { eventId: eid }
    })
    delete event.dataValues.likes
    delete event.dataValues.participants
    return reply.send({
      event: {
        ...event.dataValues,
        images: images.map(t => t.image) || [],
        likes_count: event.likes.length,
        goings_count: event.participants.length,
        me_likes: event.likes.some(t => t.userId === uid),
        me_going: event.participants.some(t => t.userId === uid)
      }
    })
  }

  send404(reply, 'event_not_found')
}

const getEventsByQuery = async (request, reply) => {
  let {
    after,
    before,
    channels,
    offset,
    limit
  } = request.query
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  channels = channels && channels.split(',')
  offset = parseInt(offset) || 0
  limit = parseInt(limit) || 25

  const query = {}
  let events, hasMore

  if (channels) query.channel_id = channels
  if (after) query.begin_time = { [Op.gte]: parseInt(after) }
  if (before) query.end_time = { [Op.lte]: parseInt(before) }

  const { count, rows } = await Event.findAndCountAll({
    where: query,
    offset,
    include: [
      {
        model: Channel,
        as: 'channel'
      },
      {
        model: User,
        as: 'creator'
      },
      {
        model: Image,
        as: 'images'
      },
      {
        model: Like,
        as: 'likes'
      },
      {
        model: Participation,
        as: 'participants'
      }
    ],
    limit
  })

  events = rows.map(item => {
    delete item.dataValues.likes
    delete item.dataValues.participants
    return {
      ...item.dataValues,
      images: item.dataValues.images.map(t => t.image),
      likes_count: item.likes.length,
      goings_count: item.participants.length,
      me_likes: item.likes.some(t => t.userId === uid),
      me_going: item.participants.some(t => t.userId === uid)
    }
  })
  hasMore = limit !== undefined && count > offset + limit

  reply.send({ events, hasMore })
}

const getEventParticipants = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const event = await Event.findOne({
    where: { id: eid },
    include: [{
      model: User
    }]
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  reply.send({ users: event.users })
}

const participateEvent = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const user = await User.findOne({ where: { id: uid } })
  const event = await Event.findOne({
    where: { id: eid },
    include: [{
      model: User,
      through: {
        where: { userId: uid }
      }
    }]
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  if (event.users.length) {
    return send403(reply, 'already_joined')
  }

  await event.addUser(user, { through: Participation })
  reply.send()
}

const getEventLiker = async (request, reply) => {
  let {
    offset,
    limit
  } = request.query
  const { isAuthed } = request.req.userStatus
  const eid = request.params.eventId

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  offset = parseInt(offset) || 0
  limit = limit && parseInt(limit)

  const event = await Event.findOne({ where: { id: eid } })
  const { count, rows } = await Like.findAndCountAll({
    where: { eventId: eid },
    offset,
    limit
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  const users = await User.findAll({
    where: { id: rows.map(like => like.dataValues.userId) }
  })

  reply.send({
    hasMore: limit !== undefined && count > offset + limit,
    users: users.map(item => {
      const { id, username, avatar } = item.dataValues
      return { id, username, avatar }
    })
  })
}

const leaveEvent = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const user = await User.findOne({ where: { id: uid } })
  const event = await Event.findOne({
    where: { id: eid }
  })
  const evtUsers = await event.getUsers()

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  if (!evtUsers.length) {
    return send404(reply, 'no_participation_record_found')
  }

  await event.removeUser(user)

  reply.send()
}

const likeEvent = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const like = await Like.findOne({
    where: {
      userId: uid,
      eventId: eid
    }
  })

  const event = await Event.findOne({
    where: { id: eid }
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  if (like) {
    return send403(reply, 'already_liked')
  }

  await Like.create({
    userId: uid,
    eventId: eid,
    like_time: Date.now()
  })

  reply.send()
}

const unlikeEvent = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed, uid } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const event = await Event.findOne({
    where: { id: eid }
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  const like = await Like.findOne({
    where: {
      userId: uid,
      eventId: eid
    }
  })

  if (!like) {
    return send404(reply, 'no_like_record_found')
  }

  await like.destroy()
  reply.send()
}

const getComments = async (request, reply) => {
  const eid = request.params.eventId
  const { isAuthed } = request.req.userStatus

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const event = await Event.findOne({
    where: { id: eid }
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  const comments = await Comment.findAll({
    where: { eventId: eid },
    include: [
      {
        model: User,
        as: 'user'
      }
    ]
  })

  reply.send({ comments })
}

const commentEvent = async (request, reply) => {
  const eid = request.params.eventId
  const comment = request.body && request.body.comment
  const { isAuthed, uid } = request.req.userStatus

  if (!comment) {
    return send400(reply, 'comment_parameter_missing')
  }

  if (!isAuthed) {
    return send403(reply, 'invalid_token')
  }

  const event = await Event.findOne({
    where: { id: eid }
  })

  if (!event) {
    return send404(reply, 'event_not_found')
  }

  const cmt = await Comment.create({
    userId: uid,
    eventId: eid,
    create_time: Date.now(),
    comment
  })

  const user = await User.findOne({
    where: { id: uid }
  })

  reply.send({
    ...cmt.dataValues,
    user
  })
}

module.exports = {
  getEventById,
  getEventsByQuery,
  getEventParticipants,
  participateEvent,
  leaveEvent,
  likeEvent,
  unlikeEvent,
  getEventLiker,
  getComments,
  commentEvent
}
