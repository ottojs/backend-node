// Modules
import { randomUUID } from 'node:crypto';
import argon2 from 'argon2';
import sql from '../../../../src/sql/index.js';
import r_v0_sessions_post from '../../../../src/routes/v0/sessions_post.route.js';

function new_req() {
	const theuuid = randomUUID();
	return {
		params: {
			uuid: theuuid,
		},
		body: {
			username: 'session@example.com',
			password: 'testsession',
		},
	};
}

function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: (x) => {
			return x;
		},
		cookie: () => {},
	};
}

describe('r_v0_sessions_post()', () => {
	beforeAll(async () => {
		const hashed = await argon2.hash('testsession');
		await sql.models.user.create({
			username: 'session@example.com',
			password: hashed,
		});
	});
	it('should return bad request when request body is invalid', (done) => {
		const req = new_req();
		req.body.username = 'invalid';
		const res = new_res();
		r_v0_sessions_post(req, res, (e) => {
			expect(e.message).toEqual('bad_request');
			done();
		});
	});
	it('should return forbidden when user is not found', (done) => {
		const req = new_req();
		req.body.username = 'none@example.com';
		const res = new_res();
		r_v0_sessions_post(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should return forbidden when password does not match', (done) => {
		const req = new_req();
		req.body.password = 'incorrect';
		const res = new_res();
		r_v0_sessions_post(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should set cookie when credentials match', (done) => {
		const req = new_req();
		const res = new_res();
		const cookie = {};
		res.cookie = (cookie_name, cookie_value, cookie_params) => {
			cookie.name = cookie_name;
			cookie.params = cookie_params;
		};
		r_v0_sessions_post(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(cookie).toEqual({
				name: 'sid',
				params: {
					httpOnly: true,
					maxAge: 28800000,
					path: '/',
					sameSite: 'Strict',
					secure: false,
					signed: true,
				},
				//value: '11ce0f05-a238-4982-a81f-43956edef293',
			});
			done();
		});
	});
	it('should set status to 201', (done) => {
		const req = new_req();
		const res = new_res();
		let status = '';
		res.status = (s) => {
			status = s;
		};
		r_v0_sessions_post(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(201);
			done();
		});
	});
	it('should set json body properties user and session', (done) => {
		const req = new_req();
		const res = new_res();
		let json = {};
		res.json = (j) => {
			json = j;
		};
		r_v0_sessions_post(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toHaveProperty('data');
			expect(json.data).toHaveProperty('session');
			expect(json.data).toHaveProperty('user');
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_sessions_post(req, res, done);
	});
});
