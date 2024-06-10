// Modules
import { randomUUID } from 'node:crypto';
import r_v0_accounts_get from '../../../../src/routes/v0/accounts_get.route.js';

function new_req() {
	return {
		params: {
			uuid: randomUUID(),
		},
		user: {
			ModelAccounts: [
				{
					name: 'Account',
					json: () => {
						return {
							name: 'AccountJson',
						};
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

describe('r_v0_accounts_get()', () => {
	it('should call next with undefined', (done) => {
		const req = new_req();
		const res = new_res();
		r_v0_accounts_get(req, res, done);
	});
	it('should respond with status code 200', (done) => {
		const req = new_req();
		const res = new_res();
		let status = 0;
		res.status = (s) => {
			status = s;
		};
		r_v0_accounts_get(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(200);
			done();
		});
	});
	it('should return array of user accounts json() with api wrapper', (done) => {
		const req = new_req();
		req.user.ModelAccounts = [
			{ json: () => 'accountjson1' },
			{ json: () => 'accountjson2' },
		];
		const res = new_res();
		let json = {};
		res.json = (j) => {
			json = j;
		};
		r_v0_accounts_get(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toEqual({
				status: 'ok',
				data: {
					accounts: ['accountjson1', 'accountjson2'],
				},
			});
			done();
		});
	});
	it('should return empty array of when user does not belong to any accounts', (done) => {
		const req = new_req();
		delete req.user.ModelAccounts;
		const res = new_res();
		let json = {};
		res.json = (j) => {
			json = j;
		};
		r_v0_accounts_get(req, res, (e) => {
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
});
