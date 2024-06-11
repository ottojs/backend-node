// Modules
import mw_require_login from '../../../src/mw/require_login.mw.js';

describe('mw_require_login()', () => {
	describe('when req.user is undefined', () => {
		it('should call next() with error unauthorized', (done) => {
			const req = {};
			mw_require_login(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'unauthorized');
				done();
			});
		});
	});
	describe('when req.user is null', () => {
		it('should call next() with error unauthorized', (done) => {
			const req = {
				user: null,
			};
			mw_require_login(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'unauthorized');
				done();
			});
		});
	});
	describe('when req.user is object with id', () => {
		it('should call next()', (done) => {
			const req = {
				user: {
					id: 1,
				},
			};
			mw_require_login(req, {}, function (e) {
				expect(e).toEqual(undefined);
				done();
			});
		});
	});
});
