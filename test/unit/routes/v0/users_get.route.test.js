// Modules
import seed from '../../../data/seed.js';
import r_v0_users_get from '../../../../src/routes/v0/users_get.route.js';

function new_req() {
	return {};
}
function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: () => {},
	};
}

describe('r_v0_users_get()', () => {
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
	});
	it('should set status to 200', (done) => {
		const req = new_req();
		const res = new_res();
		let status = '';
		res.status = (s) => {
			status = s;
		};
		r_v0_users_get(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(status).toEqual(200);
			done();
		});
	});
	it('should set json body', (done) => {
		const req = new_req();
		const res = new_res();
		let json = '';
		res.json = (j) => {
			json = j;
		};
		r_v0_users_get(req, res, (e) => {
			expect(e).toEqual(undefined);
			expect(json).toMatchObject({
				status: 'ok',
				data: {
					users: [
						{
							name_first: 'Admin',
							name_last: 'User',
							picture: '',
							username: 'admin@example.com',
						},
						{
							name_first: 'Basic',
							name_last: 'User',
							picture: '',
							username: 'user@example.com',
						},
						{
							name_first: 'Inactive',
							name_last: 'User',
							picture: '',
							username: 'inactive@example.com',
						},
					],
				},
			});
			done();
		});
	});
	it('should call next with undefined', (done) => {
		const res = new_res();
		r_v0_users_get({}, res, done);
	});
});
