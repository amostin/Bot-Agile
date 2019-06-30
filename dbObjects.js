const Sequelize = require('sequelize');

const sequelize = new Sequelize('mostinSchool', 'mostinAdmin', 'mostinPswd', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: true,
	storage: 'database.sqlite',
});

const Horodateur = sequelize.import('models/horodateur');

// on exporte nos tableaux je sais pas trop pk mais ce fichier sert a créer des associations donc jimagine que c'est un truc du genre
//je confirme car dans app.js on importe les tableaux a partir de ici
module.exports = { Horodateur };