// Modules
import { randomUUID } from 'node:crypto';
import r_v0_accounts_patch_id from '../../../../src/routes/v0/accounts_patch_id.route.js';

function new_req() {
	const theuuid = randomUUID();
	return {
		params: {
			uuid: theuuid,
		},
		body: {
			name: 'AccountNewName',
		},
		user: {
			save: () => {},
			ModelAccounts: [
				{
					save: () => {},
					json: () => {
						return {
							name: 'AccountJson',
						};
					},
					uuid: theuuid,
					name: 'Account',
					ModelJoinAccountUser: {
						roles: 'owner',
					},
				},
			],
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

describe('r_v0_accounts_patch_id()', () => {
	it('should return bad_request when UUID is invalid', (done) => {
		const req = new_req();
		req.params.uuid = 'incorrect-format';
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e.message).toEqual('bad_request');
			done();
		});
	});
	it('should return bad_request when user does not have any accounts', (done) => {
		const req = new_req();
		req.user.ModelAccounts = [];
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e.message).toEqual('bad_request');
			done();
		});
	});
	it('should return forbidden when user first account does not match given uuid', (done) => {
		const req = new_req();
		req.user.ModelAccounts[0].uuid = randomUUID();
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should return forbidden when user is not account owner', (done) => {
		const req = new_req();
		req.user.ModelAccounts[0].ModelJoinAccountUser.roles = 'admin';
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should return bad_request when body is invalid', (done) => {
		const req = new_req();
		req.body = { plan: 'monthly' };
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e.message).toEqual('bad_request');
			done();
		});
	});
	it('should update account name', (done) => {
		const req = new_req();
		req.body = { name: 'newname' };
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(req.user.ModelAccounts[0].name).toEqual('newname');
			done();
		});
	});
	it('should call account.save() to persist changes', (done) => {
		const req = new_req();
		req.body = { name: 'newname' };
		let called = false;
		req.user.ModelAccounts[0].save = () => {
			called = true;
		};
		const res = new_res();
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(called).toEqual(true);
			done();
		});
	});
	it('should return status 200', (done) => {
		const req = new_req();
		req.body = { name: 'newname' };
		const res = new_res();
		let status = 0;
		res.status = (s) => {
			status = s;
		};
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(200);
			done();
		});
	});
	it('should return account.json in api wrapper', (done) => {
		const req = new_req();
		req.body = { name: 'newname' };
		req.user.ModelAccounts[0].json = () => 'accountjson';
		const res = new_res();
		let json = {};
		res.json = (j) => {
			json = j;
		};
		r_v0_accounts_patch_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toEqual({
				status: 'ok',
				data: {
					account: 'accountjson',
				},
			});
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_accounts_patch_id(req, res, done);
	});
});
