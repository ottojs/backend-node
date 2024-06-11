// Modules
import mw_require_key from '../../../src/mw/require_key.mw.js';

describe('mw_require_key()', () => {
	describe('when req.query is undefined', () => {
		it('should call next() with error unauthorized', (done) => {
			const req = {};
			mw_require_key('access', 'granted')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'unauthorized');
				done();
			});
		});
	});
	describe('when req.query is empty object', () => {
		it('should call next() with error unauthorized', (done) => {
			const req = {
				query: {},
			};
			mw_require_key('access', 'granted')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'unauthorized');
				done();
			});
		});
	});
	describe('when req.query has correct key but incorrect value', () => {
		it('should call next() with error unauthorized', (done) => {
			const req = {
				query: {
					access: 'wrong',
				},
			};
			mw_require_key('access', 'granted')(req, {}, function (e) {
				expect(e).toHaveProperty('message', 'unauthorized');
				done();
			});
		});
	});
	describe('when req.query has correct key and correct value', () => {
		it('should call next() with error unauthorized', (done) => {
			const req = {
				query: {
					access: 'granted',
				},
			};
			mw_require_key('access', 'granted')(req, {}, function (e) {
				expect(e).toEqual(undefined);
				done();
			});
		});
	});
});
