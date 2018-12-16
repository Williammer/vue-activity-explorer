const Sequelize = require('sequelize')

module.exports = sequelize => {
  const Image = sequelize.define('image', {
    id: {
      type: Sequelize.BIGINT(20).UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    eventId: { type: Sequelize.BIGINT(20).UNSIGNED, allowNull: false },
    image: { type: Sequelize.STRING(32), allowNull: false }
  })

  return Image
}
