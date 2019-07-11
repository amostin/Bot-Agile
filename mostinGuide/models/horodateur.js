module.exports = (sequelize, DataTypes) => {
	//crée table nommée horodateur avec horodateur_id int primary key, matiere text infini
	return sequelize.define('horodateur', {
		matiere: {
			type: DataTypes.TEXT,
		},
	},{
		timestamps: true,
	}
	);
};