//réference au paquet sequelize contenant le constructeur Sequelize
const Sequelize = require('sequelize');
//on construit la bdd avec les infos de connection
const sequelize = new Sequelize('mostinSchool', 'mostinAdmin', 'mostinPswd', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	//operatorsAliases: false,
	storage: 'database.sqlite',
});
//on importe les tableau dans la bdd
sequelize.import('models/horodateur');

console.log('Database synced');
sequelize.close();