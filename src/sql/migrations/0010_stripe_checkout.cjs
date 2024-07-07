'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('stripe_checkout', {
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
			analytics_session_id: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			checkout_session_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ip_address: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			status: {
				type: Sequelize.INTEGER,
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
		await queryInterface.dropTable('stripe_checkout');
	},
};
