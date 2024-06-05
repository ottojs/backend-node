// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import debug from 'debug';
const log = debug('app:models:csp_report');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelCSPReportInit(sequelize) {
	log('[MODEL:INIT] CSP REPORT');
	class ModelCSPReport extends Model {
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				'ip',
				'headers_raw',
				'body_raw',
				'created_at',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelCSPReport.init(
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
				//defaultValue: randomUUID(),
			},
			ip: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			headers_raw: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			body_raw: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			hooks: {
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
					});
				},
			},
			sequelize,
			modelName: 'ModelCSPReport',
			// =====
			tableName: 'csp_reports',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelCSPReport;
}
