const Sequelize = require('sequelize');
const sequelize = new Sequelize('agileSchool', 'mostinAdmin', 'mostinPswd', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
//on importe les tableau dans la bdd
sequelize.import('models/daily_scrum');

console.log('Database synced');
sequelize.close();