// Modules
import { randomUUID } from 'node:crypto';
import seed from '../../../data/seed.js';
import r_v0_tasks_delete_id from '../../../../src/routes/v0/tasks_delete_id.route.js';

function new_req() {
	return {
		session: {},
		user: {
			id: 1,
		},
		params: {},
	};
}
function new_res() {
	return {
		status: () => {},
		json: () => {},
	};
}

describe('r_v0_tasks_delete_id()', () => {
	let tasks;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		tasks = await seed.tasks();
	});
	describe('when uuid is not defined', () => {
		it('should call next with bad_request', (done) => {
			const req = new_req();
			const res = new_res();
			r_v0_tasks_delete_id(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when uuid is blank', () => {
		it('should call next with bad_request', (done) => {
			const req = new_req();
			req.params.uuid = '';
			const res = new_res();
			r_v0_tasks_delete_id(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when uuid is invalid', () => {
		it('should call next with bad_request', (done) => {
			const req = new_req();
			req.params.uuid = 'invalid';
			const res = new_res();
			r_v0_tasks_delete_id(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when uuid is not found', () => {
		it('should call next with not_found', (done) => {
			const req = new_req();
			req.params.uuid = randomUUID();
			const res = new_res();
			r_v0_tasks_delete_id(req, res, (e) => {
				expect(e.message).toEqual('not_found');
				done();
			});
		});
	});
	describe('when uuid is not owned by user', () => {
		it('should call next with not_found', (done) => {
			const req = new_req();
			req.params.uuid = tasks[2].uuid;
			const res = new_res();
			r_v0_tasks_delete_id(req, res, (e) => {
				expect(e.message).toEqual('not_found');
				done();
			});
		});
	});
	describe('when uuid is owned by user', () => {
		let status = 0;
		let json = {};
		let err = true;
		beforeAll((done) => {
			const req = new_req();
			req.params.uuid = tasks[1].uuid;
			const res = new_res();
			res.status = (s) => {
				status = s;
			};
			res.json = (j) => {
				json = j;
			};
			r_v0_tasks_delete_id(req, res, (e) => {
				err = e;
				done();
			});
		});
		it('should set status to 200', () => {
			expect(status).toEqual(200);
		});
		it('should set json body', () => {
			expect(json).toEqual({
				status: 'ok',
				data: {
					task: {
						id: tasks[1].uuid,
						title: 'Admin Title 2',
						description: 'Admin Description 2',
						order: 2,
						completed: true,
						created_at: tasks[1].created_at,
						updated_at: tasks[1].updated_at,
					},
				},
			});
		});
		it('should call next with undefined', () => {
			expect(err).toEqual(undefined);
		});
		it('should mark the record as deleted', async () => {
			const reload_task = await seed.sql.models.task.findOne({
				where: {
					id: tasks[1].id,
				},
				paranoid: false,
			});
			expect(reload_task.uuid).toEqual(tasks[1].uuid);
			expect(reload_task.deleted_at).not.toEqual(null);
		});
	});
});
