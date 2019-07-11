const Sequelize = require('sequelize');

const sequelize = new Sequelize('agendaSchool', 'mostinAdmin', 'mostinPswd', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Agenda = sequelize.import('models/agenda');

module.exports = { Agenda };