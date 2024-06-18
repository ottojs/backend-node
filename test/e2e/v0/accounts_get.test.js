// Modules
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('GET /v0/accounts', () => {
	let cookies_user;
	let cookies_inactive;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		cookies_user = await seed.login('owner@example.com');
		cookies_inactive = await seed.login('inactive@example.com');
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).get('/v0/accounts');
		});
		it('should return status code 401', () => {
			expect(res.statusCode).toEqual(401);
		});
		it('should return body forbidden', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 401,
					message: 'unauthorized',
				},
			});
		});
	});
	describe('when logged in and has accounts', () => {
		it('should return user accounts', async () => {
			const res = await req(app)
				.get('/v0/accounts')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_user)
				.send({});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toMatchObject({
				status: 'ok',
				data: {
					accounts: [
						{
							name: 'User Account',
						},
					],
				},
			});
		});
	});
	describe('when logged in with zero accounts', () => {
		it('should return empty array', async () => {
			const res = await req(app)
				.get('/v0/accounts')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_inactive)
				.send({});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual({
				status: 'ok',
				data: {
					accounts: [],
				},
			});
		});
	});
});
