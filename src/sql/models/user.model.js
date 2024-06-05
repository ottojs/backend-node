// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import { z } from 'zod';
import random_hex from '../../lib/random_hex.js';
import debug from 'debug';
const log = debug('app:models:user');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelUserInit(sequelize) {
	log('[MODEL:INIT] USER');

	class ModelUser extends Model {
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
					password: z.string().min(8).max(80),
					name_first: z
						.string()
						.trim()
						.min(1)
						.max(40)
						.optional()
						.or(z.literal('')),
					name_last: z
						.string()
						.trim()
						.min(1)
						.max(40)
						.optional()
						.or(z.literal('')),
				})
				.safeParse(input);
		}
		static schema_update(input) {
			// { success: true; data: "tuna" }
			// { success: false; error: ZodError }
			//
			// .transform()
			// .refine()
			return z
				.object({
					name_first: z.string().trim().min(1).max(40),
					name_last: z.string().trim().min(1).max(40),
					picture: z
						.string()
						.trim()
						.min(1)
						.max(60)
						.optional()
						.or(z.literal(null)),
				})
				.safeParse(input);
		}
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				'username',
				//'password',
				'name_first',
				'name_last',
				'color',
				'picture',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelUser.init(
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
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name_first: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name_last: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			color: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			picture: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			hooks: {
				// https://sequelize.org/docs/v6/other-topics/hooks/#declaring-hooks
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
						name_first: '',
						name_last: '',
						color: random_hex(),
						picture: null,
					});
				},
			},
			sequelize,
			modelName: 'ModelUser',
			// =====
			tableName: 'users',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelUser;
}
