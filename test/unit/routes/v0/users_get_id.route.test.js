// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../../src/sql/index.js';
import seed from '../../../data/seed.js';
import r_v0_users_get_id from '../../../../src/routes/v0/users_get_id.route.js';

function new_req() {
	return {
		params: {
			uuid: randomUUID(),
		},
		user: {},
	};
}

function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: () => {},
	};
}

let theuuid = '';
describe('r_v0_users_get_id()', () => {
	beforeAll(async () => {
		await seed.reset();
		const result = await sql.models.user.create({
			username: 'user@example.com',
			password: 'password',
		});
		theuuid = result.uuid;
	});
	describe('when param uuid is not provided', () => {
		it('should return bad_request', (done) => {
			const req = new_req();
			delete req.params.uuid;
			const res = new_res();
			r_v0_users_get_id(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when param uuid is not "me" or a valid uuid', () => {
		it('should return bad_request', (done) => {
			const req = new_req();
			req.params.uuid = 'something-invalid';
			const res = new_res();
			r_v0_users_get_id(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when param uuid is a valid uuid and does not exist', () => {
		it('should set error not_found', (done) => {
			const req = new_req();
			req.params.uuid = randomUUID();
			const res = new_res();
			r_v0_users_get_id(req, res, (e) => {
				expect(e.message).toEqual('not_found');
				done();
			});
		});
	});
	describe('when param uuid is a valid uuid and exists', () => {
		it('should set status 200', (done) => {
			const req = new_req();
			req.params.uuid = theuuid;
			const res = new_res();
			let status = '';
			res.status = (s) => {
				status = s;
			};
			r_v0_users_get_id(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(status).toEqual(200);
				done();
			});
		});
		it('should set body to database values', (done) => {
			const req = new_req();
			req.params.uuid = theuuid;
			const res = new_res();
			let json = {};
			res.json = (j) => {
				json = j;
			};
			r_v0_users_get_id(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(json).toMatchObject({
					status: 'ok',
					data: {
						user: {
							id: theuuid,
							username: 'user@example.com',
							name_first: '',
							name_last: '',
							//color
							picture: '',
						},
					},
				});
				done();
			});
		});
		it('should call next with undefined', (done) => {
			const req = new_req();
			req.params.uuid = theuuid;
			const res = new_res();
			r_v0_users_get_id(req, res, done);
		});
	});
	describe('when user is logged in (req.user) and uuid is "me"', () => {
		it('should set status to 200', (done) => {
			const req = new_req();
			req.params.uuid = 'me';
			req.user = {
				json: () => {},
			};
			const res = new_res();
			let status = '';
			res.status = (s) => {
				status = s;
			};
			r_v0_users_get_id(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(status).toEqual(200);
				done();
			});
		});
		it('should set body to req.user', (done) => {
			const req = new_req();
			req.params.uuid = 'me';
			req.user = {
				json: () => {
					return { some: 'user' };
				},
			};
			const res = new_res();
			let json = {};
			res.json = (j) => {
				json = j;
			};
			r_v0_users_get_id(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(json).toEqual({
					status: 'ok',
					data: {
						user: { some: 'user' },
					},
				});
				done();
			});
		});
		it('should call next with undefined', (done) => {
			const req = new_req();
			req.params.uuid = 'me';
			req.user = {
				json: () => {},
			};
			const res = new_res();
			r_v0_users_get_id(req, res, done);
		});
	});
});
