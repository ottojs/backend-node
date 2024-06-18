// Modules
import req from 'supertest';
import config from '../../../src/lib/config.js';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

function valid_body() {
	return {
		username: 'user2@example.com',
		password: 'password',
		name_first: 'First',
		name_last: 'Last',
		code: config.REGISTER_CODE,
	};
}

describe('POST /v0/users', () => {
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
	});
	describe('when params are missing', () => {
		// optional: 'name_first', 'name_last'
		test.each(['username', 'password'])(
			'it should return 400 bad request',
			async (input) => {
				const body = valid_body();
				delete body[input];
				const res = await req(app)
					.post('/v0/users')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.send(body);
				expect(res.statusCode).toEqual(400);
				expect(res.body).toHaveProperty('status', 'error');
				expect(res.body).toHaveProperty('error', {
					code: 400,
					message: 'bad request',
				});
			}
		);
	});
	describe('when code is incorrect', () => {
		it('should return 403 forbidden', async () => {
			const body = valid_body();
			body.code = 'incorrect';
			const res = await req(app)
				.post('/v0/users')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(body);
			expect(res.statusCode).toEqual(403);
			expect(res.body).toHaveProperty('status', 'error');
			expect(res.body).toHaveProperty('error', {
				code: 403,
				message: 'forbidden',
			});
		});
	});
	describe('when all fields are correct', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/users')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(valid_body());
		});
		it('should return status code 201', () => {
			expect(res.statusCode).toEqual(201);
		});
		it('should return user', () => {
			expect(res.body).toHaveProperty('status', 'created');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('message', 'ok');
		});
	});
	describe('when user already exists', () => {
		let res;
		beforeAll(async () => {
			const body_user_exists = valid_body();
			body_user_exists.username = 'user@example.com';
			res = await req(app)
				.post('/v0/users')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(body_user_exists);
		});
		it('should return status code 201', () => {
			expect(res.statusCode).toEqual(201);
		});
		it('should return user', () => {
			expect(res.body).toHaveProperty('status', 'created');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('message', 'ok');
		});
	});
});
