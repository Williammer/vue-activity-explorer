'use strict'

const sendError = (reply, code, msg) => reply
  .code(code)
  .send({ error: msg })

const errorHandler = code =>
  (reply, msg) => sendError(reply, code, msg)

module.exports = {
  send400: errorHandler(400),
  send403: errorHandler(403),
  send404: errorHandler(404)
}
