// Modules
import r_csp_report from '../../../src/routes/csp_report.route.js';

function new_req() {
	return {
		ip: '127.0.0.1',
		body: {},
	};
}
function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: () => {},
	};
}

describe('r_csp_report()', () => {
	it('should set status to 201', (done) => {
		const req = new_req();
		const res = new_res();
		let status = null;
		res.status = (s) => {
			status = s;
		};
		r_csp_report(req, res, () => {
			expect(status).toEqual(201);
			done();
		});
	});
	it('should set json body to { status: "created" }', (done) => {
		const req = new_req();
		const res = new_res();
		let json = null;
		res.json = (j) => {
			json = j;
		};
		r_csp_report(req, res, () => {
			expect(json).toEqual({ status: 'created' });
			done();
		});
	});
	it('should call next', (done) => {
		const req = new_req();
		const res = new_res();
		r_csp_report(req, res, done);
	});
});
