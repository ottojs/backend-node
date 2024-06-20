// Modules
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

function valid_body() {
	return {
		title: 'New Task 1',
		description: 'my description 1',
	};
}

describe('POST /v0/tasks', () => {
	let cookies_owner;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		await seed.tasks();
		cookies_owner = await seed.login('owner@example.com');
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).post('/v0/tasks');
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
	describe('when required params are missing', () => {
		test.each(['title', 'description'])(
			'it should return 400 invalid_request',
			async (input) => {
				const body = valid_body();
				delete body[input];
				const res = await req(app)
					.post('/v0/tasks')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.set('Cookie', cookies_owner);
				expect(res.statusCode).toEqual(400);
				expect(res.body).toHaveProperty('status', 'error');
				expect(res.body).toHaveProperty('error', {
					code: 400,
					message: 'bad request',
				});
			}
		);
	});
	describe('when all fields are correct', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/tasks')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_owner)
				.send(valid_body());
		});
		it('should return status code 201', () => {
			expect(res.statusCode).toEqual(201);
		});
		it('should return task', () => {
			expect(res.body).toHaveProperty('status', 'created');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('task');
			expect(res.body.data.task).toMatchObject({
				title: 'New Task 1',
				description: 'my description 1',
				order: 100,
				completed: false,
			});
		});
	});
});
