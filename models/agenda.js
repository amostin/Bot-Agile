module.exports = (sequelize, DataTypes) => {
	return sequelize.define('agenda', {
		sujet: {
			type: DataTypes.TEXT,
		},
		date: {
			type: DataTypes.TEXT,
		},
		lieu: {
			type: DataTypes.TEXT,
			defaultValue: 'dans mon univers',
		},
		comment: {
			type: DataTypes.TEXT,
		},
	},
	{
		timestamps: true,
	}
	);
};