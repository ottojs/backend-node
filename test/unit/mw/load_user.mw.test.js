// Modules
import seed from '../../data/seed.js';
import mw_load_user from '../../../src/mw/load_user.mw.js';

describe('mw_load_user()', () => {
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
	});
	describe('when req.session is undefined', () => {
		it('should set req.user to null', async () => {
			const req = {};
			await mw_load_user(req, {}, function () {});
			expect(req.user).toEqual(null);
		});
	});
	describe('when req.session.user_id is undefined', () => {
		it('should set req.user to null', async () => {
			const req = {
				session: {},
			};
			await mw_load_user(req, {}, function () {});
			expect(req.user).toEqual(null);
		});
	});
	describe('when req.session.user_id is set and user_id does not exist', () => {
		it('should set req.user to null', async () => {
			const req = {
				session: {
					user_id: 100,
				},
			};
			await mw_load_user(req, {}, function () {});
			expect(req.user).toEqual(null);
		});
	});
	describe('when req.session.user_id is set and user_id exists without account(s)', () => {
		it('should set req.user to that user and expand accounts/roles', async () => {
			const req = {
				session: {
					user_id: 4,
				},
			};
			await mw_load_user(req, {}, function () {});
			expect(req.user).toHaveProperty('id', 4);
			expect(req.user).toHaveProperty('username', 'inactive@example.com');
			expect(req.user).toHaveProperty('name_first', 'Inactive');
			expect(req.user).toHaveProperty('name_last', 'User');
			expect(req.user.ModelAccounts).toHaveLength(0);
		});
	});
	describe('when req.session.user_id is set and user_id exists and has account(s)', () => {
		it('should set req.user to that user and expand accounts/roles', async () => {
			const req = {
				session: {
					user_id: 1,
				},
			};
			await mw_load_user(req, {}, function () {});
			expect(req.user).toHaveProperty('id', 1);
			expect(req.user).toHaveProperty('username', 'admin@example.com');
			expect(req.user).toHaveProperty('name_first', 'Admin');
			expect(req.user).toHaveProperty('name_last', 'User');
			expect(req.user.ModelAccounts).toHaveLength(1);
			expect(req.user.ModelAccounts[0]).toHaveProperty('id', 1);
			expect(req.user.ModelAccounts[0]).toHaveProperty('name', 'Admin Account');
			expect(req.user.ModelAccounts[0]).toHaveProperty('ModelJoinAccountUser');
			expect(req.user.ModelAccounts[0].ModelJoinAccountUser).toMatchObject({
				id: 1,
				account_id: 1,
				user_id: 1,
				roles: 'admin',
			});
		});
	});
});
