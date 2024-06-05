// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../../src/sql/index.js';

describe('ModelAccount', () => {
	describe('.validate()', () => {
		it('should populate uuid automatically when undefined', () => {
			const account = sql.models.account.build({
				name: 'Account',
			});
			expect(account.uuid).toEqual(undefined);
			account.validate();
			expect(typeof account.uuid).toBe('string');
		});
		it('should keep provided uuid', () => {
			const theuuid = randomUUID();
			const account = sql.models.account.build({
				name: 'Account',
				uuid: theuuid,
			});
			expect(account.uuid).toEqual(theuuid);
			account.validate();
			expect(account.uuid).toEqual(theuuid);
		});
	});
	describe('.schema()', () => {
		it('should not allow empty call', () => {
			const r = sql.models.account.schema();
			expect(r.success).toEqual(false);
		});
		it('should not allow username undefined', () => {
			const r = sql.models.account.schema({});
			expect(r.success).toEqual(false);
		});
		it('should not allow name empty string', () => {
			const r = sql.models.account.schema({
				name: '',
			});
			expect(r.success).toEqual(false);
		});
		it('should allow name', () => {
			const r = sql.models.account.schema({
				name: 'Acme',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				name: 'Acme',
			});
		});
		it('should trim name left', () => {
			const r = sql.models.account.schema({
				name: ' Acme',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				name: 'Acme',
			});
		});
		it('should trim name right', () => {
			const r = sql.models.account.schema({
				name: 'Acme ',
			});
			expect(r.success).toEqual(true);
			expect(r.data).toEqual({
				name: 'Acme',
			});
		});
	});
	describe('.json()', () => {
		it('should only show approved fields', () => {
			const theuuid = randomUUID();
			const thedate = new Date();
			const account = sql.models.account.build({
				id: 100,
				uuid: theuuid,
				name: 'Account',
				created_at: thedate,
				updated_at: thedate,
				deleted_at: thedate,
			});
			expect(account.json()).toEqual({
				id: theuuid,
				name: 'Account',
			});
		});
	});
});
