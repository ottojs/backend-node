// Modules
import r_root from '../../../src/routes/root.route.js';

describe('r_root()', () => {
	it('should set status to 200', (done) => {
		let status;
		const res = {
			status: (int) => {
				status = int;
			},
			json: () => {},
		};
		r_root({}, res, () => {
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
		r_root({}, res, () => {
			expect(json).toEqual({ status: 'ok' });
			done();
		});
	});
	it('should call next', (done) => {
		const res = {
			status: () => {},
			json: () => {},
		};
		r_root({}, res, done);
	});
});
