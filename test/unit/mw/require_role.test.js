// Modules
import mw_require_role from '../../../src/mw/require_role.mw.js';

describe('mw_require_role()', () => {
	describe('when req.user is undefined', () => {
		it('should call next() with error forbidden', (done) => {
			const req = {};
			mw_require_role('admin')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'forbidden');
				done();
			});
		});
	});
	describe('when req.user is null', () => {
		it('should call next() with error forbidden', (done) => {
			const req = {
				user: null,
			};
			mw_require_role('admin')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'forbidden');
				done();
			});
		});
	});
	describe('when req.user is object with id only', () => {
		it('should call next() with error forbidden', (done) => {
			const req = {
				user: {
					id: 1,
				},
			};
			mw_require_role('admin')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'forbidden');
				done();
			});
		});
	});
	describe('when req.user is object with accounts information and incorrect role', () => {
		it('should call next() with error forbidden', (done) => {
			const req = {
				user: {
					id: 1,
					ModelAccounts: [
						{
							roles: ['readonly'],
						},
					],
				},
			};
			mw_require_role('admin')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'forbidden');
				done();
			});
		});
	});
	describe('when req.user is object with accounts information and correct role', () => {
		it('should call next()', (done) => {
			const req = {
				user: {
					id: 1,
					ModelAccounts: [
						{
							roles: ['admin'],
						},
					],
				},
			};
			mw_require_role('admin')(req, {}, function (e) {
				expect(e).toEqual(undefined);
				done();
			});
		});
	});
});
