// Modules
import seed from '../../../data/seed.js';
import r_v0_tasks_post from '../../../../src/routes/v0/tasks_post.route.js';

function new_req() {
	return {
		session: {},
		user: {
			id: 1,
		},
	};
}
function new_res() {
	return {
		status: () => {},
		json: () => {},
	};
}

describe('r_v0_tasks_post()', () => {
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		await seed.tasks();
	});
	describe('when body is invalid', () => {
		it('should call next with bad_request', (done) => {
			const req = new_req();
			const res = new_res();
			r_v0_tasks_post(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when body is valid', () => {
		it('should set status to 201 created', (done) => {
			const req = new_req();
			req.body = {
				title: 'title1',
			};
			const res = new_res();
			let status = 0;
			res.status = (s) => {
				status = s;
			};
			r_v0_tasks_post(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(status).toEqual(201);
				done();
			});
		});
		it('should set json body', (done) => {
			const req = new_req();
			req.body = {
				title: 'title2',
				description: 'desc2',
			};
			const res = new_res();
			let json = {};
			res.json = (j) => {
				json = j;
			};
			r_v0_tasks_post(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(json).toMatchObject({
					status: 'created',
					data: {
						task: {
							title: 'title2',
							description: 'desc2',
							order: 100,
							completed: false,
						},
					},
				});
				done();
			});
		});
		it('should call next with undefined', (done) => {
			const req = new_req();
			req.body = {
				title: 'title3',
			};
			const res = new_res();
			r_v0_tasks_post(req, res, done);
		});
	});
});
