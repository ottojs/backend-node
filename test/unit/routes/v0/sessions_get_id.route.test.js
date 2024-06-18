// Modules
import { randomUUID } from 'node:crypto';
import r_v0_sessions_get_id from '../../../../src/routes/v0/sessions_get_id.route.js';

function new_req() {
	return {
		params: {
			uuid: 'me',
		},
		body: {
			name: 'AccountNewName',
		},
		user: {
			ModelAccounts: [
				{
					json: () => {},
				},
			],
			json: () => {},
		},
		session: {
			json: () => {},
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

describe('r_v0_sessions_get_id()', () => {
	it('should return forbidden when uuid is not "me"', (done) => {
		const req = new_req();
		req.params.uuid = randomUUID();
		req.user.ModelAccounts = [];
		const res = new_res();
		r_v0_sessions_get_id(req, res, (e) => {
			expect(e.message).toEqual('forbidden');
			done();
		});
	});
	it('should return accounts as an empty array when user has zero accounts', (done) => {
		const req = new_req();
		req.user.ModelAccounts = [];
		const res = new_res();
		let json;
		res.json = (j) => {
			json = j;
		};
		r_v0_sessions_get_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toEqual({
				status: 'ok',
				data: {
					accounts: [],
				},
			});
			done();
		});
	});
	it('should return accounts .json() when multiple accounts are attached', (done) => {
		const req = new_req();
		req.user.ModelAccounts = [
			{
				json: () => 'one',
			},
			{
				json: () => 'two',
			},
		];
		const res = new_res();
		let json;
		res.json = (j) => {
			json = j;
		};
		r_v0_sessions_get_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toEqual({
				status: 'ok',
				data: {
					accounts: ['one', 'two'],
				},
			});
			done();
		});
	});
	it('should return account, user, and session data', (done) => {
		const req = new_req();
		req.session = {
			json: () => 'session',
		};
		req.user.json = () => 'user';
		req.user.ModelAccounts = [
			{
				json: () => 'one',
			},
		];
		const res = new_res();
		let json;
		res.json = (j) => {
			json = j;
		};
		r_v0_sessions_get_id(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toEqual({
				status: 'ok',
				data: {
					session: 'session',
					user: 'user',
					accounts: ['one'],
				},
			});
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_sessions_get_id(req, res, done);
	});
});
