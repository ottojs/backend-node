// Modules
import { randomUUID } from 'node:crypto';
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('DELETE /v0/tasks/:uuid', () => {
	let tasks;
	let cookies_owner;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		tasks = await seed.tasks();
		cookies_owner = await seed.login('owner@example.com');
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).delete('/v0/tasks/' + randomUUID());
		});
		it('should return status code 401 unauthorized', () => {
			expect(res.statusCode).toEqual(401);
		});
		it('should return json body error 401 unauthorized', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 401,
					message: 'unauthorized',
				},
			});
		});
	});
	describe('when uuid is invalid', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.delete('/v0/tasks/notvalid')
				.set('Cookie', cookies_owner);
		});
		it('should return status code 400 bad request', () => {
			expect(res.statusCode).toEqual(400);
		});
		it('should return json body error 400 bad request', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 400,
					message: 'bad request',
				},
			});
		});
	});
	describe('when uuid does not exist', () => {
		let res;
		const theuuid = randomUUID();
		beforeAll(async () => {
			res = await req(app)
				.delete('/v0/tasks/' + theuuid)
				.set('Cookie', cookies_owner);
		});
		it('should return status code 404 not found', () => {
			expect(res.statusCode).toEqual(404);
		});
		it('should return json body error 404 not found', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 404,
					message: 'not found',
					path: '/v0/tasks/' + theuuid,
				},
			});
		});
	});
	describe('when uuid is not owned by user', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.delete('/v0/tasks/' + tasks[0].uuid)
				.set('Cookie', cookies_owner);
		});
		it('should return status code 404 not found', () => {
			expect(res.statusCode).toEqual(404);
		});
		it('should return json body error 404 not found', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 404,
					message: 'not found',
					path: '/v0/tasks/' + tasks[0].uuid,
				},
			});
		});
	});
	describe('when uuid is owned by user', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.delete('/v0/tasks/' + tasks[2].uuid)
				.set('Cookie', cookies_owner);
		});
		it('should return status code 200 ok', () => {
			expect(res.statusCode).toEqual(200);
		});
		it('should return json body 200 ok', async () => {
			const reload_task = await seed.sql.models.task.findOne({
				where: {
					id: tasks[2].id,
				},
				paranoid: false,
			});
			// String is correct but we parse the Date for comparison
			res.body.data.task.created_at = new Date(res.body.data.task.created_at);
			res.body.data.task.updated_at = new Date(res.body.data.task.updated_at);
			expect(res.body).toEqual({
				status: 'ok',
				data: {
					task: {
						id: reload_task.uuid,
						title: 'Owner Title 1',
						description: 'Owner Description 1',
						order: 1,
						completed: false,
						created_at: reload_task.created_at,
						updated_at: tasks[2].updated_at,
					},
				},
			});
		});
	});
});
