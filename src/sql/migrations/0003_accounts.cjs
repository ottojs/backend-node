'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Accounts
		await queryInterface.createTable(
			'accounts',
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
				name: {
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
						name: 'idx_accounts_uniq_uuid',
						unique: true,
						fields: ['uuid'],
					},
				],
			}
		);
	},
	async down(queryInterface) {
		await queryInterface.dropTable('accounts');
	},
};
