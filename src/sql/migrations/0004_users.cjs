'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'users',
			{
				id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
				},
				uuid: {
					type: Sequelize.UUID,
					unique: true,
					allowNull: false,
				},
				username: {
					type: Sequelize.STRING,
					unique: true,
					allowNull: false,
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				name_first: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				name_last: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				color: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				picture: {
					type: Sequelize.STRING,
					allowNull: false,
				},
				created_at: {
					type: Sequelize.DATE,
					allowNull: false,
				},
				updated_at: {
					type: Sequelize.DATE,
					allowNull: false,
				},
				deleted_at: {
					type: Sequelize.DATE,
					allowNull: true,
				},
			},
			{
				// TODO: Does a unique index get created by specifying "unique" above?
				indexes: [
					{
						name: 'idx_users_uniq_uuid',
						unique: true,
						fields: ['uuid'],
					},
					{
						name: 'idx_uniq_username',
						unique: true,
						fields: ['username'],
					},
				],
			}
		);
	},
	async down(queryInterface) {
		await queryInterface.dropTable('users');
	},
};
