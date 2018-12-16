const Sequelize = require('sequelize')

module.exports = sequelize => {
  const Comment = sequelize.define('comment', {
    id: {
      type: Sequelize.BIGINT(20).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    userId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    eventId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    create_time: { type: Sequelize.DATE, allowNull: false },
    comment: { type: Sequelize.TEXT, allowNull: false }
  })

  return Comment
}
