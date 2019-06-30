module.exports = (sequelize, DataTypes) => {
	//crée table nommée horodateur avec horodateur_id int primary key, matiere text infini
	return sequelize.define('horodateur', {
		horodateur_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			//autoIncrement: true,
		},
		matiere: {
			type: DataTypes.TEXT,
		},
	},
	);
};