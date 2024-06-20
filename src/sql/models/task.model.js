// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import { z } from 'zod';
import debug from 'debug';
const log = debug('app:models:task');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelTaskInit(sequelize) {
	log('[MODEL:INIT] TASK');
	class ModelTask extends Model {
		static schema(input) {
			// { success: true; data: "tuna" }
			// { success: false; error: ZodError }
			//
			// .transform()
			// .refine()
			return z
				.object({
					// Required
					title: z.string().trim().min(1).max(50),
					// Optional
					description: z
						.string()
						.trim()
						.min(1)
						.max(90)
						.optional()
						.or(z.literal('')),
					order: z.number().optional(),
					completed: z.boolean().optional(),
				})
				.safeParse(input);
		}
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				//'user_id',
				'title',
				'description',
				'order',
				'completed',
				'created_at',
				'updated_at',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelTask.init(
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
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			order: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			completed: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				//defaultValue: false,
			},
		},
		{
			hooks: {
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
						order: 100,
						completed: false,
					});
				},
			},
			sequelize,
			modelName: 'ModelTask',
			// =====
			tableName: 'tasks',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelTask;
}
