// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../../src/sql/index.js';

describe('ModelSession', () => {
	describe('.validate()', () => {
		it('should populate uuid automatically when undefined', () => {
			const session = sql.models.session.build({
				user_id: 1,
				max_age: 3600,
			});
			expect(session.uuid).toEqual(undefined);
			session.validate();
			expect(typeof session.uuid).toBe('string');
		});
		it('should keep provided uuid', () => {
			const theuuid = randomUUID();
			const session = sql.models.session.build({
				user_id: 1,
				max_age: 3600,
				uuid: theuuid,
			});
			expect(session.uuid).toEqual(theuuid);
			session.validate();
			expect(session.uuid).toEqual(theuuid);
		});
	});
	describe('.schema()', () => {
		it('should not allow empty call', () => {
			const r = sql.models.session.schema();
			expect(r.success).toEqual(false);
		});
		it('should not allow username undefined', () => {
			const r = sql.models.session.schema({});
			expect(r.success).toEqual(false);
		});
		it('should not allow username empty string', () => {
			const r = sql.models.session.schema({
				username: '',
			});
			expect(r.success).toEqual(false);
		});
		it('should not allow password undefined', () => {
			const r = sql.models.session.schema({
				username: 'user',
			});
			expect(r.success).toEqual(false);
		});
		it('should not allow password empty string', () => {
			const r = sql.models.session.schema({
				username: 'user',
				password: '',
			});
			expect(r.success).toEqual(false);
		});
		it('should allow valid body', () => {
			const r = sql.models.session.schema({
				username: 'user@example.com',
				password: 'password',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				username: 'user@example.com',
				password: 'password',
			});
		});
		it('should trim username left', () => {
			const r = sql.models.session.schema({
				username: ' user@example.com',
				password: 'password',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				username: 'user@example.com',
				password: 'password',
			});
		});
		it('should trim username right', () => {
			const r = sql.models.session.schema({
				username: 'user@example.com ',
				password: 'password',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				username: 'user@example.com',
				password: 'password',
			});
		});
		it('should not trim password left', () => {
			const r = sql.models.session.schema({
				username: 'user@example.com',
				password: ' password',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				username: 'user@example.com',
				password: ' password',
			});
		});
		it('should not trim password right', () => {
			const r = sql.models.session.schema({
				username: 'user@example.com',
				password: 'password ',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				username: 'user@example.com',
				password: 'password ',
			});
		});
	});
	describe('.json()', () => {
		it('should only show approved fields', () => {
			const theuuid = randomUUID();
			const thedate = new Date();
			const session = sql.models.session.build({
				id: 100,
				uuid: theuuid,
				user_id: 1,
				max_age: 3600,
				deleted_reason: 'none',
				created_at: thedate,
				updated_at: thedate,
				deleted_at: thedate,
			});
			expect(session.json()).toEqual({
				id: theuuid,
				max_age: 3600,
				created_at: thedate,
			});
		});
	});
});
