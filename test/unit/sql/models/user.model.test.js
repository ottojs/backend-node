// Modules
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import sql from '../../../../src/sql/index.js';

describe('ModelUser', () => {
	describe('schema()', () => {
		function valid_params() {
			return {
				username: 'user@example.com',
				password: 'plainpass',
			};
		}
		it('should return invalid when username is not an email', () => {
			const params = valid_params();
			params.username = 'username';
			const result = sql.models.user.schema(params);
			expect(result).toHaveProperty('success', false);
			expect(result.error.flatten().fieldErrors).toHaveProperty('username');
			expect(result.error.flatten().fieldErrors.username).toContain('Invalid email address');
		});
	});
	describe('schema_update()', () => {
		function valid_params() {
			return {
				name_first: 'First',
				name_last: 'Last',
				picture: null,
				color: '#000000',
			};
		}
		it('should return invalid when name_first is not provided', () => {
			const params = valid_params();
			delete params.name_first;
			const result = sql.models.user.schema_update(params);
			expect(result).toHaveProperty('success', false);
			expect(result.error.flatten().fieldErrors).toHaveProperty('name_first');
			expect(result.error.flatten().fieldErrors.name_first).toContain('Invalid input: expected string, received undefined');
		});
		it('should return invalid when name_last is not provided', () => {
			const params = valid_params();
			delete params.name_last;
			const result = sql.models.user.schema_update(params);
			expect(result).toHaveProperty('success', false);
			expect(result.error.flatten().fieldErrors).toHaveProperty('name_last');
			expect(result.error.flatten().fieldErrors.name_last).toContain('Invalid input: expected string, received undefined');
		});
	});
	describe('uuid', () => {
		it('should populate uuid automatically when undefined', () => {
			const user = sql.models.user.build({
				username: 'user@example.com',
				password: 'nothing',
				name_first: 'First',
				name_last: 'Last',
			});
			expect(user.uuid).toEqual(undefined);
			user.validate();
			expect(typeof user.uuid).toBe('string');
		});
		it('should keep provided uuid', () => {
			const theuuid = randomUUID();
			const user = sql.models.user.build({
				username: 'user@example.com',
				password: 'nothing',
				name_first: 'First',
				name_last: 'Last',
				uuid: theuuid,
			});
			expect(user.uuid).toEqual(theuuid);
			user.validate();
			expect(user.uuid).toEqual(theuuid);
		});
	});
});
