// Modules
import sql from '../../../../src/sql/index.js';
import r_v0_users_post from '../../../../src/routes/v0/users_post.route.js';

function new_req() {
	return {
		body: {
			username: 'user@example.com',
			password: 'somepassword',
			code: '1234',
		},
	};
}

function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: () => {},
	};
}

describe('r_v0_users_post()', () => {
	beforeAll(async () => {
		await sql.models.user.create({
			username: 'userexists@example.com',
			password: 'password',
		});
	});
	it('should fail when body is not valid', (done) => {
		const req = new_req();
		delete req.body.username;
		const res = new_res();
		r_v0_users_post(req, res, (e) => {
			expect(e.message).toEqual('bad_request');
			done();
		});
	});
	it('should fail when code is incorrect', (done) => {
		const req = new_req();
		req.body.code = 'NOPE';
		const res = new_res();
		r_v0_users_post(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should succeed when user exists (intentional decoy)', (done) => {
		const req = new_req();
		req.body.username = 'userexists@example.com';
		const res = new_res();
		let status = '';
		let json = '';
		res.status = (s) => {
			status = s;
		};
		res.json = (j) => {
			json = j;
		};
		r_v0_users_post(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(201);
			expect(json).toEqual({
				status: 'created',
				data: {
					message: 'ok',
				},
			});
			done();
		});
	});
	it('should succeed when user does not exist', (done) => {
		const req = new_req();
		req.body.username = 'newuser@example.com';
		const res = new_res();
		let status = '';
		let json = '';
		res.status = (s) => {
			status = s;
		};
		res.json = (j) => {
			json = j;
		};
		r_v0_users_post(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(201);
			expect(json).toEqual({
				status: 'created',
				data: {
					message: 'ok',
				},
			});
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_users_post(req, res, done);
	});
});
