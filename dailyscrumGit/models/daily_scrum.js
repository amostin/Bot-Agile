module.exports = (sequelize, DataTypes) => {
	return sequelize.define('daily_scrum', {
		hier: {
			type: DataTypes.TEXT,
		},
		ajd: {
			type: DataTypes.TEXT,
		},
		blocke: {
			type: DataTypes.TEXT,
		},
	},{
		timestamps: true,
	}
	);
};