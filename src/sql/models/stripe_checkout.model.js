// Modules
import { randomUUID } from 'node:crypto';
import { DataTypes, Model } from 'sequelize';
import _ from 'lodash';
import debug from 'debug';
const log = debug('app:models:stripe_checkout');

// https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
export default function ModelStripeCheckoutInit(sequelize) {
	log('[MODEL:INIT] STRIPE CHECKOUT');
	class ModelStripeCheckout extends Model {
		json() {
			const returnable = _.pick(this, [
				//'id',
				'uuid',
				//'analytics_session_id',
				//'checkout_session_id',
				//'ip_address',
				'status',
			]);
			returnable.id = returnable.uuid;
			delete returnable.uuid;
			return returnable;
		}
	}
	ModelStripeCheckout.init(
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
			analytics_session_id: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			checkout_session_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ip_address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			hooks: {
				// (obj, options)
				beforeValidate: (obj) => {
					_.defaults(obj, {
						uuid: randomUUID(),
						status: 0,
					});
				},
			},
			sequelize,
			modelName: 'ModelStripeCheckout',
			// =====
			tableName: 'stripe_checkout',
			paranoid: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
		}
	);
	return ModelStripeCheckout;
}
