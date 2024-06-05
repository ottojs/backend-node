'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('csp_reports', {
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
			ip: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			headers_raw: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			body_raw: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable('csp_reports');
	},
};
