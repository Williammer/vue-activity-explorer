const Sequelize = require('sequelize')

module.exports = sequelize => {
  const Like = sequelize.define('like', {
    id: {
      type: Sequelize.BIGINT(20).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    userId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false, unique: 'compositeIndex' },
    eventId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false, unique: 'compositeIndex' },
    like_time: { type: Sequelize.DATE, allowNull: false }
  })

  return Like
}
