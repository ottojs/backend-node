// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import { z } from 'zod';
import debug from 'debug';
const log = debug('app:models:session');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelSessionInit(sequelize) {
	log('[MODEL:INIT] SESSION');
	class ModelSession extends Model {
		static schema(input) {
			// { success: true; data: "tuna" }
			// { success: false; error: ZodError }
			//
			// .transform()
			// .refine()
			return z
				.object({
					// Required
					username: z.string().trim().toLowerCase().email().min(6).max(80),
					// Don't trim password in case spaces are part of password
					password: z.string().min(8).max(50),
				})
				.safeParse(input);
		}
		json() {
			const returnable = _.pick(this, [
				//id
				'uuid',
				//'user_id',
				'max_age',
				'created_at',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelSession.init(
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
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			max_age: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			deleted_reason: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			hooks: {
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
						max_age: 60 * 10, // 10 minutes
					});
				},
			},
			sequelize,
			modelName: 'ModelSession',
			// =====
			tableName: 'sessions',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelSession;
}
