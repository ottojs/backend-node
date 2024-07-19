// Modules
import mw_request_start from '../../../src/mw/request_start.mw.js';

function new_req() {
	return {
		method: 'GET',
		path: '/test',
		ip: '127.0.0.1',
		headers: {},
		query: {},
		appdata: {
			time_start: Date.now() - 1000,
		},
	};
}

describe('mw_request_start()', () => {
	it('should set req.appdata.time_start to current timestamp', (done) => {
		const req = {};
		mw_request_start(req, {}, () => {
			expect(req).toHaveProperty('appdata');
			expect(req.appdata).toHaveProperty('time_start');
			expect(req.appdata.time_start).toBeGreaterThan(Date.now() - 5000);
			expect(req.appdata.time_start).toBeLessThan(Date.now() + 5000);
			done();
		});
	});
	it('should set req.appdata.uuid', (done) => {
		const req = new_req();
		mw_request_start(req, {}, () => {
			expect(req.appdata).toHaveProperty('uuid');
			done();
		});
	});
	it('should set req.appdata.method', (done) => {
		const req = new_req();
		mw_request_start(req, {}, () => {
			expect(req.appdata).toHaveProperty('method', 'GET');
			done();
		});
	});
	it('should set req.appdata.path', (done) => {
		const req = new_req();
		mw_request_start(req, {}, () => {
			expect(req.appdata).toHaveProperty('path', '/test');
			done();
		});
	});
	it('should set req.appdata.ip', (done) => {
		const req = new_req();
		mw_request_start(req, {}, () => {
			expect(req.appdata).toHaveProperty('ip', '127.0.0.1');
			done();
		});
	});
	it('should set res.locals', (done) => {
		const req = new_req();
		const res = {};
		mw_request_start(req, res, () => {
			expect(res).toHaveProperty('locals', {});
			done();
		});
	});
	it('should call next()', (done) => {
		mw_request_start(new_req(), {}, done);
	});
});
