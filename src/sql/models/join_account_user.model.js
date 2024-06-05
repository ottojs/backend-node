// Modules
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import debug from 'debug';
const log = debug('app:models:join_account_user');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelJoinAccountUserInit(sequelize) {
	log('[MODEL:INIT] JOIN ACCOUNT USER');
	class ModelJoinAccountUser extends Model {
		json() {
			const returnable = _.pick(this, [
				//'id',
				'account_id',
				'user_id',
				'roles',
			]);
			return returnable;
		}
	}
	ModelJoinAccountUser.init(
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			account_id: {
				type: DataTypes.INTEGER,
				unique: false,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				unique: false,
				allowNull: false,
			},
			roles: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			hooks: {
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						roles: '',
					});
				},
			},
			sequelize,
			modelName: 'ModelJoinAccountUser',
			// =====
			tableName: 'join_account_user',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelJoinAccountUser;
}
