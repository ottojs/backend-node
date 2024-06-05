// Modules
import sql from '../../../../src/sql/index.js';

describe('ModelJoinAccountUser', () => {
	describe('.validate()', () => {
		it('should default roles to empty string', () => {
			const join = sql.models.join_account_user.build({
				account_id: 1,
				user_id: 1,
			});
			expect(join.roles).toEqual(undefined);
			join.validate();
			expect(join.roles).toEqual('');
		});
		it('should keep roles when provided', () => {
			const join = sql.models.join_account_user.build({
				account_id: 1,
				user_id: 1,
				roles: 'some,thing',
			});
			expect(join.roles).toEqual('some,thing');
			join.validate();
			expect(join.roles).toEqual('some,thing');
		});
	});
	describe('.json()', () => {
		it('should only show approved fields', () => {
			const thedate = new Date();
			const join = sql.models.join_account_user.build({
				id: 100,
				account_id: 1,
				user_id: 2,
				roles: 'json',
				created_at: thedate,
				updated_at: thedate,
				deleted_at: thedate,
			});
			expect(join.json()).toEqual({
				account_id: 1,
				user_id: 2,
				roles: 'json',
			});
		});
	});
});
