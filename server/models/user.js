
const Sequelize = require('sequelize')

module.exports = sequelize => {
  const User = sequelize.define('user', {
    id: { type: Sequelize.BIGINT(20).UNSIGNED, primaryKey: true, allowNull: false, autoIncrement: true },
    username: { type: Sequelize.STRING(32), allowNull: false, unique: true },
    password: { type: Sequelize.STRING(32), allowNull: false },
    email: { type: Sequelize.STRING(64), allowNull: false, unique: true },
    salt: { type: Sequelize.STRING(32), allowNull: false },
    avatar: { type: Sequelize.STRING(64), allowNull: false }
  })
  return User
}
