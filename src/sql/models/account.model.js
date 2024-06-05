// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import { z } from 'zod';
import debug from 'debug';
const log = debug('app:models:account');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelAccountInit(sequelize) {
	log('[MODEL:INIT] ACCOUNT');
	class ModelAccount extends Model {
		static schema(input) {
			// { success: true; data: "tuna" }
			// { success: false; error: ZodError }
			//
			// .transform()
			// .refine()
			return z
				.object({
					// Required
					name: z.string().trim().min(2).max(40),
				})
				.safeParse(input);
		}
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				'name',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelAccount.init(
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
			name: {
				type: DataTypes.STRING,
				allowNull: false,
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
			modelName: 'ModelAccount',
			// =====
			tableName: 'accounts',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelAccount;
}
