const Sequelize = require('sequelize')

module.exports = sequelize => {
  const Event = sequelize.define('event', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    name: { type: Sequelize.STRING(128), allowNull: false },
    creator_id: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    channel_id: { type: Sequelize.INTEGER(10).UNSIGNED, allowNull: false },
    begin_time: { type: Sequelize.DATE, allowNull: false },
    end_time: { type: Sequelize.DATE, allowNull: false },
    create_time: { type: Sequelize.DATE, allowNull: false },
    update_time: { type: Sequelize.DATE, allowNull: false },
    location: { type: Sequelize.STRING(255), allowNull: false },
    location_detail: { type: Sequelize.STRING(255), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false }
  })

  return Event
}
