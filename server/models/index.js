let User,
  Event,
  Participation,
  Comment,
  Image,
  Like,
  Channel

const connect = async () => {
  const Sequelize = require('sequelize')
  const sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    operatorsAliases: Sequelize.Op,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    storage: './db/database.sqlite'
  })

  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })
  _pangolier.sequelize = sequelize
}

const loadModels = async () => {
  const { sequelize } = _pangolier

  User = require('./user.js')(sequelize)
  Event = require('./event.js')(sequelize)
  Participation = require('./participation.js')(sequelize)
  Comment = require('./comment.js')(sequelize)
  Image = require('./image.js')(sequelize)
  Like = require('./like.js')(sequelize)
  Channel = require('./channel.js')(sequelize)

  // setting associations
  Event.belongsToMany(User, { through: Participation })
  User.belongsToMany(Event, { through: Participation })

  Event.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' })
  Event.belongsTo(Channel, { foreignKey: 'channel_id', as: 'channel' })

  Like.belongsTo(User, { foreignKey: 'userId' })
  Like.belongsTo(Event, { foreignKey: 'eventId' })

  Comment.belongsTo(User, { foreignKey: 'userId' })
  Comment.belongsTo(Event, { foreignKey: 'eventId' })

  Event.hasMany(Image, { foreignKey: 'eventId' })
  Event.hasMany(Like, { foreignKey: 'eventId' })
  Event.hasMany(Participation, { foreignKey: 'eventId', as: 'participants' })

  return Promise.all([
    User.sync({ force: true }),
    Event.sync({ force: true }),
    Participation.sync({ force: true }),
    Comment.sync({ force: true }),
    Image.sync({ force: true }),
    Like.sync({ force: true }),
    Channel.sync({ force: true })
  ])
}

const initDBContent = models => {
  for (const item of ['Jobs', 'Games', 'Hiring', 'Sports', 'Travel', 'Undirectlookable', 'Programming', 'Sleeping', 'Painting', 'Special']) {
    Channel.create({
      name: item
    })
  }

  User.create({
    username: 'Jinyang.Li',
    password: 'df10ef8509dc176d733d59549e7dbfaf', // 123456
    salt: 'abc',
    email: 'test@gmail.com',
    avatar: 'https://coding.net/static/fruit_avatar/Fruit-19.png'
  })

  User.create({
    username: 'rexskz',
    password: 'df10ef8509dc176d733d59549e7dbfaf', // 123456
    salt: 'abc',
    email: 'rex@rexskz.info',
    avatar: 'https://coding.net/static/fruit_avatar/Fruit-20.png'
  })

  for (let i = 0; i < 50; ++i) {
    User.create({
      username: `user_${i}`,
      password: 'df10ef8509dc176d733d59549e7dbfaf', // 123456
      salt: 'abc',
      email: `user_${i}@example.com`,
      avatar: `https://coding.net/static/fruit_avatar/Fruit-${i % 20 + 1}.png`
    })
  }

  Event.create({
    name: 'Activity Title Name Make it Longer May Longer than One Line',
    creator_id: (Math.random() * 50) | 0 + 1,
    channel_id: (Math.random() * 10) | 0 + 1,
    begin_time: Date.now(),
    end_time: Date.now() + 86400000,
    create_time: Date.now(),
    update_time: Date.now(),
    location: 'Marina Bay Sands',
    location_detail: '10 Bayfront Ave, S018956',
    description: '[No longer than 300 chars] Vivamus sagittis, diam in lobortis, sapien arcu mattis erat, vel aliquet sem urna et risus. Ut feugiat sapien mi potenti. Maecenas et enim odio. Nullam massa metus, varius quis vehicula sed, pharetra mollis erat. In quis viverra velit. Vivamus placerat, est nec hendrerit varius, enim dui hendrerit magna, ut pulvinar nibh lorem vel lacus. Mauris a orci iaculis, hendrerit eros sed, gravida leo. In dictum mauris vel augue varius there is south north asim.',
    goings_count: 34,
    likes_count: 10
  })

  for (let i = 0; i < 1000; ++i) {
    Event.create({
      name: `Test event no. ${i}`,
      creator_id: (Math.random() * 50) | 0 + 1,
      channel_id: (Math.random() * 10) | 0 + 1,
      begin_time: Date.now() + 500000 * i,
      end_time: Date.now() + 86400000 + 500000 * i,
      create_time: Date.now(),
      update_time: Date.now(),
      location: 'Secret',
      location_detail: 'Secret place.',
      description: 'This is just a test data for entry task, use it for fun! This is just a test data for entry task, use it for fun! This is just a test data for entry task, use it for fun!',
      goings_count: 0,
      likes_count: 0
    })
  }

  for (const item of [
    'w8XC0KPitDfMEeSv9P3GxgHaEt&w=248&h=160',
    'B7gjATIkLyifGdknxysjVwHaFj&w=222&h=167',
    'NI9vpiDmGzrQLPKq23e2_wHaFj&w=234&h=173',
    'rzUYVz0YoOqkmoehDQcKRgHaEo&w=295&h=181',
    'wTqIPNLDZ96_gPsHc-pplQHaFI&w=228&h=160'
  ]) {
    for (let i = 0; i < 3; ++i) {
      Image.create({
        eventId: 1 + i * 2,
        image: `https://tse2-mm.cn.bing.net/th?id=OIP.${item}&c=7&o=5&dpr=2&pid=1.7`
      })
    }
  }

  for (let i = 0; i < 10; ++i) {
    Like.create({
      userId: 1,
      eventId: 1 + i * 3,
      like_time: Date.now()
    })
    Like.create({
      userId: 2 + i * 3,
      eventId: 1,
      like_time: Date.now()
    })
  }

  for (let i = 0; i < 10; ++i) {
    Participation.create({
      userId: 1,
      eventId: 1 + i * 2
    })
    Participation.create({
      userId: 2 + i * 2,
      eventId: 1
    })
  }

  for (let k = 0; k < 10; k++) {
    const count = (Math.random() * 20) | 0
    for (let i = 0; i < count; ++i) {
      Comment.create({
        userId: (Math.random() * 50) | 0 + 1,
        eventId: k + 1,
        create_time: Date.now(),
        comment: 'Great! Gonna join! What I actually want to say is that this is a really long comment maybe more than one line and you should display it correctly. Don\'t block me out, thanks...'
      })
    }
  }
}

module.exports = {
  getModels: () => {
    return {
      User,
      Event,
      Participation,
      Comment,
      Image,
      Like,
      Channel
    }
  },
  initModels: async () => {
    await connect()
    await loadModels()
    initDBContent()
  }
}
