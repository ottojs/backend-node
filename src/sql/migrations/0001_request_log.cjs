'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('request_logs', {
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
			method: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			path: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			time_total: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			time_routes: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			// ==================
			// === IP Address ===
			// ==================
			ip: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ip_geo_raw: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			ip_geo_country: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			ip_geo_region: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			ip_geo_city: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			ip_geo_eu: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			// ==================
			// === User Agent ===
			// ==================
			browser_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			browser_version: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			device_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			os_name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			os_version: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			cpu_arch: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			// ================
			// === Referrer ===
			// ================
			referrer_raw: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			referrer_domain: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			referrer_source: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			// ====================================
			// === UTM / Urchin Tracking Module ===
			// ====================================
			utm_source: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			utm_medium: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			utm_campaign: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			utm_content: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			utm_term: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			// ======================
			// === Processed Flag ===
			// ======================
			processed: {
				type: Sequelize.BOOLEAN,
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
		await queryInterface.dropTable('request_logs');
	},
};
