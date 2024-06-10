// Modules
import { randomUUID } from 'node:crypto';
import config from '../../../../src/lib/config.js';
import r_v0_sessions_delete from '../../../../src/routes/v0/sessions_delete.route.js';

function new_req() {
	return {
		params: {
			uuid: 'me',
		},
		session: {
			save: async () => {},
			destroy: async () => {},
			json: () => {},
		},
	};
}

function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: () => {},
		clearCookie: () => {},
	};
}

describe('r_v0_sessions_delete()', () => {
	it('should return "forbidden" when uuid is not "me"', (done) => {
		const req = new_req();
		req.params.uuid = randomUUID();
		const res = new_res();
		r_v0_sessions_delete(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should set deleted_reason to "manual"', (done) => {
		const req = new_req();
		req.session.deleted_reason = 'nothing';
		const res = new_res();
		r_v0_sessions_delete(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(req.session.deleted_reason).toEqual('manual');
			done();
		});
	});
	it('should call save() to persist updated information', (done) => {
		const req = new_req();
		let called = false;
		req.session.save = () => {
			called = true;
		};
		const res = new_res();
		r_v0_sessions_delete(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(called).toEqual(true);
			done();
		});
	});
	it('should call destroy() to mark session as removed', (done) => {
		const req = new_req();
		let called = false;
		req.session.destroy = () => {
			called = true;
		};
		const res = new_res();
		r_v0_sessions_delete(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(called).toEqual(true);
			done();
		});
	});
	it('should call res.clearCookie() with config cookie name to remove', (done) => {
		const req = new_req();
		const res = new_res();
		let called = false;
		res.clearCookie = (key) => {
			called = key;
		};
		r_v0_sessions_delete(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(called).toEqual(config.COOKIE_NAME_SESSION);
			done();
		});
	});
	it('should call res.status() with 200', (done) => {
		const req = new_req();
		const res = new_res();
		let status = 0;
		res.status = (s) => {
			status = s;
		};
		r_v0_sessions_delete(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(200);
			done();
		});
	});
	it('should return the session.json() with wrapper as body', (done) => {
		const req = new_req();
		req.session.json = () => 'thesession';
		const res = new_res();
		let json = {};
		res.json = (j) => {
			json = j;
		};
		r_v0_sessions_delete(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toEqual({
				status: 'ok',
				data: {
					session: 'thesession',
				},
			});
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_sessions_delete(req, res, done);
	});
});
