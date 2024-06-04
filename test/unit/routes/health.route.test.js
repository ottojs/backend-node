// Modules
import r_health from '../../../src/routes/health.route.js';

describe('r_health()', () => {
	it('should set status to 200', (done) => {
		let status;
		const res = {
			status: (int) => {
				status = int;
			},
			json: () => {},
		};
		r_health({}, res, () => {
			expect(status).toEqual(200);
			done();
		});
	});
	it('should set json to { status : "ok" }', (done) => {
		let json;
		const res = {
			status: () => {},
			json: (obj) => {
				json = obj;
			},
		};
		r_health({}, res, () => {
			expect(json).toEqual({ status: 'ok' });
			done();
		});
	});
	it('should call next', (done) => {
		const res = {
			status: () => {},
			json: () => {},
		};
		r_health({}, res, done);
	});
});
