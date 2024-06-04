// Modules
import mw_error_handler from '../../../src/mw/error_handler.mw.js';

describe('mw_error_handler()', () => {
	describe('when error is unexpected', () => {
		it('should set status to 500', (done) => {
			let status;
			const res = {
				status: (int) => {
					status = int;
				},
				json: () => {},
			};
			mw_error_handler(new Error('unexpected'), {}, res, () => {
				expect(status).toEqual(500);
				done();
			});
		});
		it('should set json to "internal server error"', (done) => {
			let json;
			const res = {
				status: () => {},
				json: (obj) => {
					json = obj;
				},
			};
			mw_error_handler(new Error('unexpected'), {}, res, () => {
				expect(json).toEqual({
					status: 'error',
					error: { code: 500, message: 'internal server error' },
				});
				done();
			});
		});
		it('should call next', (done) => {
			const res = {
				status: () => {},
				json: () => {},
			};
			mw_error_handler(new Error('unexpected'), {}, res, done);
		});
	});
	describe('when error is not_found', () => {
		it('should set status to 404', (done) => {
			let status;
			const res = {
				status: (int) => {
					status = int;
				},
				json: () => {},
			};
			mw_error_handler(new Error('not_found'), {}, res, () => {
				expect(status).toEqual(404);
				done();
			});
		});
		it('should set json to "not found"', (done) => {
			let json;
			const res = {
				status: () => {},
				json: (obj) => {
					json = obj;
				},
			};
			mw_error_handler(
				new Error('not_found'),
				{
					path: '/does-not-exist',
				},
				res,
				() => {
					expect(json).toEqual({
						status: 'error',
						error: {
							code: 404,
							message: 'not found',
							path: '/does-not-exist',
						},
					});
					done();
				}
			);
		});
		it('should call next', (done) => {
			const res = {
				status: () => {},
				json: () => {},
			};
			mw_error_handler(new Error('not_found'), {}, res, done);
		});
	});
});
