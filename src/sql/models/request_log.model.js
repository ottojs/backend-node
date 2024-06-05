// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes } from 'sequelize';
import _ from 'lodash';
import debug from 'debug';
const log = debug('app:models:request_log');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelRequestLogInit(sequelize) {
	log('[MODEL:INIT] REQUEST LOG');
	const ModelRequestLog = sequelize.define(
		'ModelRequestLog',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			uuid: {
				type: DataTypes.UUID,
				unique: true,
				allowNull: false,
			},
			method: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			path: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			time_total: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			time_routes: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			// ==================
			// === IP Address ===
			// ==================
			ip: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ip_geo_raw: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			ip_geo_country: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			ip_geo_region: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			ip_geo_city: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			ip_geo_eu: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			// ============================
			// === Browser / User-Agent ===
			// ============================
			browser_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			browser_version: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			device_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			os_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			os_version: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			cpu_arch: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			// ================
			// === Referrer ===
			// ================
			referrer_raw: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			referrer_domain: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			referrer_source: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			// ====================================
			// === UTM / Urchin Tracking Module ===
			// ====================================
			utm_source: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			utm_medium: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			utm_campaign: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			utm_term: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			utm_content: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			// ======================
			// === Processed Flag ===
			// ======================
			processed: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
		},
		{
			hooks: {
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
						processed: false,
					});
				},
			},
			tableName: 'request_logs',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelRequestLog;
}
