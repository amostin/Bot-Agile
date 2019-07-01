const Sequelize = require('sequelize');

const sequelize = new Sequelize('agileSchool', 'mostinAdmin', 'mostinPswd', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: true,
	storage: 'database.sqlite',
});

const Daily_scrum = sequelize.import('models/daily_scrum');

module.exports = { Daily_scrum };
