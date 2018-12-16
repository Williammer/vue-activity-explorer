'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User, Channel, Like, Participation, Event } = _pangolier.getModels()
const { send403, send400 } = _pangolier.utils

module.exports = {
  getUserInfo: async (request, reply) => {
    const { isAuthed, uid } = request.req.userStatus

    if (!isAuthed) {
      return send403(reply, 'invalid_token')
    }

    const user = await User.findOne({ where: { id: uid } })
    const likesCount = await Like.count({ where: { userId: uid } })
    const pastCount = await user.countEvents({
      where: {
        begin_time: {
          [Op.lte]: Date.now()
        }
      }
    })

    const goingsCount = await user.countEvents({
      where: {
        begin_time: {
          [Op.gte]: Date.now()
        }
      }
    })

    const { id, username, email, avatar } = user.dataValues

    reply.send({
      id,
      username,
      email,
      avatar,
      likes_count: likesCount,
      past_count: pastCount,
      goings_count: goingsCount
    })
  },

  getUserEvents: async (request, reply) => {
    let {
      offset,
      limit,
      events,
      type
    } = request.query
    const { isAuthed, uid } = request.req.userStatus

    if (!isAuthed) {
      return send403(reply, 'invalid_token')
    }

    if (!type) {
      return send400(reply, 'missing paramater `type`')
    }

    const user = await User.findOne({ where: { id: uid } })

    const include = [
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

    switch (type) {
      case 'liked':
        const like = await Like.findAll({ where: { userId: uid } })
        events = await Event.findAll({
          where: {
            id: like.map(item => item.dataValues.eventId)
          },
          offset,
          limit,
          include
        })
        break
      case 'going':
        const participant = await Participation.findAll({ where: { userId: uid } })
        events = await user.getEvents({
          where: {
            id: participant.map(item => item.dataValues.eventId),
            begin_time: {
              [Op.gte]: Date.now()
            }
          },
          offset,
          limit,
          include
        })
        break
      case 'past':
        events = await user.getEvents({
          where: {
            begin_time: {
              [Op.lte]: Date.now()
            }
          },
          offset,
          limit,
          include
        })
        break
      default:
        return send400(reply, 'invalid `type` value')
    }

    reply.send({
      events: events.map(item => {
        delete item.dataValues.likes
        delete item.dataValues.participants
        return {
          ...item.dataValues,
          likes_count: item.likes.length,
          goings_count: item.participants.length,
          me_likes: item.likes.some(t => t.userId === uid),
          me_going: item.participants.some(t => t.userId === uid)
        }
      })
    })
  }
}
