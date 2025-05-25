// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../../src/sql/index.js';

describe('ModelStripeCheckout', () => {
	describe('.validate()', () => {
		it('should populate uuid automatically when undefined', () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
			});
			expect(checkout.uuid).toEqual(undefined);
			checkout.validate();
			expect(typeof checkout.uuid).toBe('string');
		});

		it('should keep provided uuid', () => {
			const theuuid = randomUUID();
			const checkout = sql.models.stripe_checkout.build({
				uuid: theuuid,
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
			});
			expect(checkout.uuid).toEqual(theuuid);
			checkout.validate();
			expect(checkout.uuid).toEqual(theuuid);
		});

		it('should set default status to 0', () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
			});
			expect(checkout.status).toEqual(undefined);
			checkout.validate();
			expect(checkout.status).toEqual(0);
		});

		it('should keep provided status', () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
				status: 1,
			});
			expect(checkout.status).toEqual(1);
			checkout.validate();
			expect(checkout.status).toEqual(1);
		});

		it('should require analytics_session_id', async () => {
			const checkout = sql.models.stripe_checkout.build({
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
			});
			await expect(checkout.validate()).rejects.toThrow();
		});

		it('should require checkout_session_id', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				ip_address: '192.168.1.1',
			});
			await expect(checkout.validate()).rejects.toThrow();
		});

		it('should require ip_address', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
			});
			await expect(checkout.validate()).rejects.toThrow();
		});

		it('should validate successfully with all required fields', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
			});
			await expect(checkout.validate()).resolves.not.toThrow();
		});
	});

	describe('.json()', () => {
		it('should only show approved fields', () => {
			const theuuid = randomUUID();
			const analytics_session_id = randomUUID();
			const thedate = new Date();
			const checkout = sql.models.stripe_checkout.build({
				id: 100,
				uuid: theuuid,
				analytics_session_id: analytics_session_id,
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
				status: 1,
				created_at: thedate,
				updated_at: thedate,
				deleted_at: thedate,
			});
			expect(checkout.json()).toEqual({
				id: theuuid,
				status: 1,
			});
		});

		it('should transform uuid to id in json output', () => {
			const theuuid = randomUUID();
			const checkout = sql.models.stripe_checkout.build({
				uuid: theuuid,
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
				status: 0,
			});
			const json = checkout.json();
			expect(json.id).toEqual(theuuid);
			expect(json.uuid).toEqual(undefined);
		});

		it('should include status in json output', () => {
			const checkout = sql.models.stripe_checkout.build({
				uuid: randomUUID(),
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
				status: 2,
			});
			const json = checkout.json();
			expect(json.status).toEqual(2);
		});
	});

	describe('fields validation', () => {
		it('should accept valid UUID for analytics_session_id', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '192.168.1.1',
			});
			await expect(checkout.validate()).resolves.not.toThrow();
		});

		it('should accept valid string for checkout_session_id', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_live_abcdef1234567890',
				ip_address: '192.168.1.1',
			});
			await expect(checkout.validate()).resolves.not.toThrow();
		});

		it('should accept valid IP address', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '10.0.0.1',
			});
			await expect(checkout.validate()).resolves.not.toThrow();
		});

		it('should accept IPv6 address', async () => {
			const checkout = sql.models.stripe_checkout.build({
				analytics_session_id: randomUUID(),
				checkout_session_id: 'cs_test_1234567890',
				ip_address: '2001:db8::1',
			});
			await expect(checkout.validate()).resolves.not.toThrow();
		});

		it('should accept different status values', async () => {
			const statuses = [0, 1, 2, 10, 99];
			for (const status of statuses) {
				const checkout = sql.models.stripe_checkout.build({
					analytics_session_id: randomUUID(),
					checkout_session_id: 'cs_test_1234567890',
					ip_address: '192.168.1.1',
					status: status,
				});
				await expect(checkout.validate()).resolves.not.toThrow();
			}
		});
	});

	describe('model configuration', () => {
		it('should have correct table name', () => {
			expect(sql.models.stripe_checkout.getTableName()).toEqual(
				'stripe_checkout'
			);
		});

		it('should have paranoid enabled (soft deletes)', () => {
			expect(sql.models.stripe_checkout.options.paranoid).toEqual(true);
		});

		it('should have timestamps enabled', () => {
			expect(sql.models.stripe_checkout.options.timestamps).toEqual(true);
		});

		it('should have correct timestamp field names', () => {
			expect(sql.models.stripe_checkout.options.createdAt).toEqual(
				'created_at'
			);
			expect(sql.models.stripe_checkout.options.updatedAt).toEqual(
				'updated_at'
			);
			expect(sql.models.stripe_checkout.options.deletedAt).toEqual(
				'deleted_at'
			);
		});
	});
});
