'use strict';

module.exports = exports = {
	production: {
		username: process.env.SQL_USERNAME,
		password: process.env.SQL_PASSWORD,
		database: process.env.SQL_DATABASE,
		host: '/cloudsql/' + process.env.SQL_CONNNAME,
		dialect: 'postgres',
		dialectOptions: {
			socketPath: '/cloudsql/' + process.env.SQL_CONNNAME,
		},
	},
};
