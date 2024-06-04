// Modules
import mw_request_end from '../../../src/mw/request_end.mw.js';

function new_req() {
	return {
		headers: {},
		query: {},
		appdata: {
			time_start: Date.now() - 5000,
		},
	};
}

describe('mw_request_end()', () => {
	it('should set req.appdata.time_end to now', (done) => {
		const req = new_req();
		mw_request_end(req, {}, () => {
			expect(req).toHaveProperty('appdata');
			expect(req.appdata).toHaveProperty('time_end');
			expect(req.appdata.time_end).toBeGreaterThan(Date.now() - 500);
			expect(req.appdata.time_end).toBeLessThan(Date.now() + 500);
			done();
		});
	});
	it('should set req.appdata.time_total to 5 seconds (total)', (done) => {
		const req = new_req();
		mw_request_end(req, {}, () => {
			expect(req).toHaveProperty('appdata');
			expect(req.appdata).toHaveProperty('time_total');
			expect(req.appdata.time_total).toBeGreaterThan(4750);
			expect(req.appdata.time_total).toBeLessThan(5250);
			done();
		});
	});
	it('should call next()', (done) => {
		mw_request_end(new_req(), {}, done);
	});
});
