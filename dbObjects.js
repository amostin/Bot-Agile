const Sequelize = require('sequelize');

const sequelize = new Sequelize('mostinSchool', 'mostinAdmin', 'mostinPswd', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: true,
	storage: 'database.sqlite',
});

const Horodateur = sequelize.import('models/horodateur');
module.exports = { Horodateur };
