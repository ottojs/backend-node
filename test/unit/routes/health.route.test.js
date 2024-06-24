// Modules
import r_health from '../../../src/routes/health.route.js';

describe('r_health()', () => {
	it('should set status to 200', () => {
		let status;
		const res = {
			status: (int) => {
				status = int;
			},
			json: () => {},
		};
		r_health({}, res);
		expect(status).toEqual(200);
	});
	it('should set json to { status : "ok" }', () => {
		let json;
		const res = {
			status: () => {},
			json: (obj) => {
				json = obj;
			},
		};
		r_health({}, res);
		expect(json).toEqual({ status: 'ok' });
	});
});
