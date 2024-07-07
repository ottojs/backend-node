// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import { z } from 'zod';
import debug from 'debug';
const log = debug('app:models:analytics:event');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelAnalyticsEventInit(sequelize) {
	log('[MODEL:INIT] ANALYTICS EVENT');
	class ModelAnalyticsEvent extends Model {
		static schema(input) {
			// { success: true; data: "tuna" }
			// { success: false; error: ZodError }
			//
			// .transform()
			// .refine()
			return z
				.object({
					// Required
					name: z.string().trim().toLowerCase().min(2).max(40),
					session_id: z.string().trim().toLowerCase().uuid(),
				})
				.safeParse(input);
		}
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				'session_id',
				'name',
				//'ip_address',
				//'data',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelAnalyticsEvent.init(
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
			session_id: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
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
			modelName: 'ModelAnalyticsEvent',
			// =====
			tableName: 'analytics_events',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelAnalyticsEvent;
}
