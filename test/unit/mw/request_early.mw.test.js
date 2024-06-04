// Modules
import mw_request_early from '../../../src/mw/request_early.mw.js';

describe('mw_request_early()', () => {
	it('should set req.appdata.time_start to current timestamp', (done) => {
		const req = {};
		mw_request_early(req, {}, () => {
			expect(req).toHaveProperty('appdata');
			expect(req.appdata).toHaveProperty('time_start');
			expect(req.appdata.time_start).toBeGreaterThan(Date.now() - 5000);
			expect(req.appdata.time_start).toBeLessThan(Date.now() + 5000);
			done();
		});
	});
	it('should call next()', (done) => {
		mw_request_early({}, {}, done);
	});
});
