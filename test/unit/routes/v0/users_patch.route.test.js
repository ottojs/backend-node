// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../../src/sql/index.js';
import helper from '../../../helpers/db.js';
import r_v0_users_patch_id from '../../../../src/routes/v0/users_patch_id.route.js';

function new_req() {
	return {
		params: {
			uuid: 'me',
		},
		body: {
			name_first: 'First',
			name_last: 'Last',
			picture: '',
		},
		user: {
			save: () => {},
			json: () => {},
			name_first: '',
			name_last: '',
			picture: '',
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

describe('r_v0_users_patch_id()', () => {
	let theuser = {};
	beforeAll(async () => {
		await helper.reset();
		await helper.users();
		theuser = await sql.models.user.findOne({
			where: {
				id: 1,
			},
		});
	});
	it('should return forbidden when uuid is not "me"', (done) => {
		const req = new_req();
		req.user = theuser;
		req.params.uuid = randomUUID();
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should return forbidden when body is invalid', (done) => {
		const req = new_req();
		req.user = theuser;
		req.body = { name_first: 'NeedsLastNameAndPicture' };
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e.message).toEqual('bad_request');
			done();
		});
	});
	it('should update name_first', (done) => {
		const req = new_req();
		req.user = theuser;
		req.body.name_first = 'UpdateFirst';
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(req.user.name_first).toEqual('UpdateFirst');
			done();
		});
	});
	it('should update name_last', (done) => {
		const req = new_req();
		req.user = theuser;
		req.body.name_last = 'UpdateLast';
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(req.user.name_last).toEqual('UpdateLast');
			done();
		});
	});
	it('should update picture', (done) => {
		const req = new_req();
		req.user = theuser;
		req.body.picture = 'UpdatePicture';
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(req.user.picture).toEqual('UpdatePicture');
			done();
		});
	});
	it('should update color when set to "new"', (done) => {
		const req = new_req();
		req.user = theuser;
		const originalcolor = theuser.color;
		req.body.color = 'new';
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(req.user.color).not.toEqual(originalcolor);
			done();
		});
	});
	it('should call req.user.save', (done) => {
		const req = new_req();
		req.user = theuser;
		let called = false;
		req.user.save = () => {
			called = true;
		};
		const res = new_res();
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(called).toEqual(true);
			done();
		});
	});
	it('should set status to 200', (done) => {
		const req = new_req();
		req.user = theuser;
		const res = new_res();
		let status;
		res.status = (s) => {
			status = s;
		};
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(200);
			done();
		});
	});
	it('should set body to json', (done) => {
		const req = new_req();
		req.user = theuser;
		req.body.name_first = 'UpFirst';
		req.body.name_last = 'UpLast';
		const res = new_res();
		let json;
		res.json = (j) => {
			json = j;
		};
		r_v0_users_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toMatchObject({
				status: 'ok',
				data: {
					user: {
						name_first: 'UpFirst',
						name_last: 'UpLast',
						picture: '',
						username: 'admin@example.com',
					},
				},
			});
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_users_patch_id(req, res, done);
	});
});
