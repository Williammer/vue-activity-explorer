'use strict'

const { Channel } = _pangolier.getModels()
const { send403 } = _pangolier.utils

module.exports = {
  getChannels: async (request, reply) => {
    const { isAuthed } = request.req.userStatus

    if (isAuthed) {
      const channels = await Channel.findAll()

      return reply.send({
        channels: channels.map(item => item.dataValues)
      })
    }

    return send403(reply, 'invalid_token')
  }
}
