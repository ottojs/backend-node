// Modules
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('GET /v0/tasks', () => {
	let cookies_admin;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		cookies_admin = await seed.login('admin@example.com');
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).get('/v0/tasks');
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
	describe('when logged in but 0 tasks', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).get('/v0/tasks').set('Cookie', cookies_admin);
		});
		it('should return status code 200', () => {
			expect(res.statusCode).toEqual(200);
		});
		it('should return empty array of tasks', () => {
			expect(res.body).toEqual({
				status: 'ok',
				data: {
					tasks: [],
				},
			});
		});
	});
	describe('when logged in and there are 3 tasks but 2 owned by admin', () => {
		let res;
		beforeAll(async () => {
			await seed.tasks();
			res = await req(app).get('/v0/tasks').set('Cookie', cookies_admin);
		});
		it('should return status code 200', () => {
			expect(res.statusCode).toEqual(200);
		});
		it('should return 2 tasks', () => {
			expect(res.body).toMatchObject({
				status: 'ok',
			});
			expect(res.body.data).toHaveProperty('tasks');
			expect(res.body.data.tasks).toHaveLength(2);
			expect(res.body.data.tasks[0]).toHaveProperty('id');
		});
	});
});
