
const { fetch, URLSearchParams } = window

let defaultToken

const makeUrl = (url, params) => {
  if (!params) return `/api/v1${url}`

  const keys = Object.keys(params)
  const usp = new URLSearchParams()

  keys.forEach(key =>
    usp.append(key, Array.isArray(params[key]) ? params[key].join(',') : params[key]))

  return `/api/v1${url}?${usp.toString()}`
}

const makeApi = ({ url, method, data, token, headers }) => {
  const params = {
    method,
    headers: headers || {},
    credentials: 'include'
  }

  const prefixedUrl = makeUrl(url, method === 'GET' && data)
  const body =
    (method === 'POST' || method === 'PUT' || method === 'PATCH') && data

  if (body) {
    params.body = JSON.stringify(body)
    params.headers['content-type'] = params.headers['content-type'] || 'application/json'
  }

  if (token) {
    params.headers['X-BLACKCAT-TOKEN'] = token
  }

  return fetch(prefixedUrl, params)
}

const apis = {
  // User auth
  auth: {
    join: data => makeApi({
      url: '/join',
      method: 'POST',
      data
    }),
    auth: data => makeApi({
      url: '/auth/token',
      method: 'POST',
      data
    }),
    unauth: (token = defaultToken) => makeApi({
      url: '/auth/token',
      method: 'DELETE',
      token
    })
  },

  // Channels
  Channels: {
    getChannels: (token = defaultToken) => makeApi({
      url: '/channels',
      method: 'GET',
      token
    })
  },

  // Events
  Events: {
    getEvents: (data, token = defaultToken) => makeApi({
      url: '/events',
      method: 'GET',
      data,
      token
    }),
    getEvent: (eid, token = defaultToken) => makeApi({
      url: `/events/${eid}`,
      method: 'GET',
      token
    }),
    getParticipants: (eid, token = defaultToken) => makeApi({
      url: `/events/${eid}/participants`,
      method: 'GET',
      token
    }),
    participateEvent: (eid, token = defaultToken) => makeApi({
      url: `/events/${eid}/participants`,
      method: 'POST',
      token
    }),
    leaveEvent: (eid, token = defaultToken) => makeApi({
      url: `/events/${eid}/participants`,
      method: 'DELETE',
      token
    }),
    getComments: (eid, data, token = defaultToken) => makeApi({
      url: `/events/${eid}/comments`,
      method: 'GET',
      data,
      token
    }),
    commentEvent: (eid, comment, token = defaultToken) => makeApi({
      url: `/events/${eid}/comments`,
      method: 'POST',
      data: { comment },
      token
    }),
    getEventLiker: (eid, data, token = defaultToken) => makeApi({
      url: `/events/${eid}/likes`,
      method: 'GET',
      data,
      token
    }),
    likeEvent: (eid, token = defaultToken) => makeApi({
      url: `/events/${eid}/likes`,
      method: 'POST',
      token
    }),
    unlikeEvent: (eid, token = defaultToken) => makeApi({
      url: `/events/${eid}/likes`,
      method: 'DELETE',
      token
    })
  },

  // Users
  Users: {
    getUser: (token = defaultToken) => makeApi({
      url: '/user',
      method: 'GET',
      token
    }),
    getUserEvents: (data, token = defaultToken) => makeApi({
      url: `/user/events`,
      method: 'GET',
      data,
      token
    })
  }
}

window._pangolier = { apis }

// Test
const test = async () => {
  await apis.auth.join({
    username: 'aaaa',
    password: '123456',
    email: 'test@shopee.com',
    avatar: 'https://coding.net/static/fruit_avatar/Fruit-19.png'
  })

  const auth = await apis.auth.auth({
    username: 'aaaa',
    password: '123456'
  })

  auth.json().then(async res => {
    await _pangolier.apis.Events.getEvents(null, res.token)
    await _pangolier.apis.Events.participateEvent(1, res.token)
    await _pangolier.apis.Events.leaveEvent(1, res.token)
    await _pangolier.apis.Events.likeEvent(1, res.token)
    await _pangolier.apis.Events.getEventLiker(1, null, res.token)
    await _pangolier.apis.Events.unlikeEvent(1, res.token)
    await _pangolier.apis.Events.commentEvent(1, 'test comment !', res.token)
    await _pangolier.apis.Events.getComments(1, null, res.token)

    await _pangolier.apis.Users.getUser(res.token)
    await _pangolier.apis.Users.getUser(res.token)

    await _pangolier.apis.Users.getUserEvents({ type: 'liked' }, res.token)
    await _pangolier.apis.Users.getUserEvents({ type: 'going' }, res.token)
    await _pangolier.apis.Users.getUserEvents({ type: 'past' }, res.token)
  })
}

test()
