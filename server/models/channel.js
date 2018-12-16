const Sequelize = require('sequelize')

module.exports = sequelize => {
  const Channel = sequelize.define('channel', {
    id: {
      type: Sequelize.INTEGER(10).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: { type: Sequelize.STRING(32), allowNull: false }
  })

  return Channel
}
