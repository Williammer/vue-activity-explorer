const Sequelize = require('sequelize')

module.exports = sequelize => {
  const Participation = sequelize.define('participation', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    userId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    eventId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false }
  })

  return Participation
}
