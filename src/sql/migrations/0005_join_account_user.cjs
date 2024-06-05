'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('join_account_user', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			account_id: {
				type: Sequelize.INTEGER,
				unique: false,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				unique: false,
				allowNull: false,
			},
			roles: {
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
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('join_account_user');
	},
};
