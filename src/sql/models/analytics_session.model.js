// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import debug from 'debug';
const log = debug('app:models:analytics:session');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelAnalyticsSessionInit(sequelize) {
	log('[MODEL:INIT] ANALYTICS SESSION');
	class ModelAnalyticsSession extends Model {
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				//'ip_address',
				//'data',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelAnalyticsSession.init(
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
			ip_address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			data: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			hooks: {
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
						data: '',
					});
				},
			},
			sequelize,
			modelName: 'ModelAnalyticsSession',
			// =====
			tableName: 'analytics_sessions',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelAnalyticsSession;
}
