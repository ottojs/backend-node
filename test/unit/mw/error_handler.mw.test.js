// Modules
import mw_error_handler from '../../../src/mw/error_handler.mw.js';

describe('mw_error_handler()', () => {
	describe('when error is bad_request', () => {
		it('should set status to 400', (done) => {
			let status;
			const res = {
				status: (int) => {
					status = int;
				},
				json: () => {},
			};
			mw_error_handler(new Error('bad_request'), {}, res, () => {
				expect(status).toEqual(400);
				done();
			});
		});
		it('should set json to "bad request"', (done) => {
			let json;
			const res = {
				status: () => {},
				json: (obj) => {
					json = obj;
				},
			};
			mw_error_handler(new Error('bad_request'), {}, res, () => {
				expect(json).toEqual({
					status: 'error',
					error: {
						code: 400,
						message: 'bad request',
					},
				});
				done();
			});
		});
		it('should call next', (done) => {
			const res = {
				status: () => {},
				json: () => {},
			};
			mw_error_handler(new Error('bad_request'), {}, res, done);
		});
	});
	describe('when error is unauthorized', () => {
		it('should set status to 401', (done) => {
			let status;
			const res = {
				status: (int) => {
					status = int;
				},
				json: () => {},
			};
			mw_error_handler(new Error('unauthorized'), {}, res, () => {
				expect(status).toEqual(401);
				done();
			});
		});
		it('should set json to "unauthorized"', (done) => {
			let json;
			const res = {
				status: () => {},
				json: (obj) => {
					json = obj;
				},
			};
			mw_error_handler(new Error('unauthorized'), {}, res, () => {
				expect(json).toEqual({
					status: 'error',
					error: {
						code: 401,
						message: 'unauthorized',
					},
				});
				done();
			});
		});
		it('should call next', (done) => {
			const res = {
				status: () => {},
				json: () => {},
			};
			mw_error_handler(new Error('unauthorized'), {}, res, done);
		});
	});
	describe('when error is forbidden', () => {
		it('should set status to 403', (done) => {
			let status;
			const res = {
				status: (int) => {
					status = int;
				},
				json: () => {},
			};
			mw_error_handler(new Error('forbidden'), {}, res, () => {
				expect(status).toEqual(403);
				done();
			});
		});
		it('should set json to "forbidden"', (done) => {
			let json;
			const res = {
				status: () => {},
				json: (obj) => {
					json = obj;
				},
			};
			mw_error_handler(new Error('forbidden'), {}, res, () => {
				expect(json).toEqual({
					status: 'error',
					error: {
						code: 403,
						message: 'forbidden',
					},
				});
				done();
			});
		});
		it('should call next', (done) => {
			const res = {
				status: () => {},
				json: () => {},
			};
			mw_error_handler(new Error('forbidden'), {}, res, done);
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
});
