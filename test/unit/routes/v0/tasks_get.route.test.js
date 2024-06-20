// Modules
import seed from '../../../data/seed.js';
import r_v0_tasks_get from '../../../../src/routes/v0/tasks_get.route.js';

function new_req() {
	return {
		session: {},
		user: {},
	};
}
function new_res() {
	return {
		status: () => {},
		json: () => {},
	};
}

describe('r_v0_tasks_get()', () => {
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		await seed.tasks();
	});
	describe('when logged in as admin', () => {
		it('should set status to 200', (done) => {
			const req = new_req();
			req.user.id = 1;
			const res = new_res();
			let status = 0;
			res.status = (s) => {
				status = s;
			};
			r_v0_tasks_get(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(status).toEqual(200);
				done();
			});
		});
		it('should set json body of admin tasks only', (done) => {
			const req = new_req();
			req.user.id = 1;
			const res = new_res();
			let json = {};
			res.json = (j) => {
				json = j;
			};
			r_v0_tasks_get(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(json).toMatchObject({
					status: 'ok',
					data: {
						tasks: [
							{
								title: 'Admin Title 1',
								description: 'Admin Description 1',
								order: 1,
								completed: false,
							},
							{
								title: 'Admin Title 2',
								description: 'Admin Description 2',
								order: 2,
								completed: true,
							},
						],
					},
				});
				done();
			});
		});
	});
	describe('when logged in as owner', () => {
		it('should set status to 200', (done) => {
			const req = new_req();
			req.user.id = 2;
			const res = new_res();
			let status = 0;
			res.status = (s) => {
				status = s;
			};
			r_v0_tasks_get(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(status).toEqual(200);
				done();
			});
		});
		it('should set json body of owner tasks only', (done) => {
			const req = new_req();
			req.user.id = 2;
			const res = new_res();
			let json = {};
			res.json = (j) => {
				json = j;
			};
			r_v0_tasks_get(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(json).toMatchObject({
					status: 'ok',
					data: {
						tasks: [
							{
								title: 'Owner Title 1',
								description: 'Owner Description 1',
								order: 1,
								completed: false,
							},
						],
					},
				});
				done();
			});
		});
	});
	describe('in all cases', () => {
		it('should call next with undefined', (done) => {
			const req = new_req();
			req.user.id = 1;
			const res = new_res();
			r_v0_tasks_get(req, res, done);
		});
	});
});
