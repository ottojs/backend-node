// Modules
import { randomUUID } from 'node:crypto';
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('GET /v0/users/:uuid', () => {
	let users;
	beforeAll(async () => {
		await seed.reset();
		users = await seed.users();
	});
	describe('when uuid is not "me" or valid uuid', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).get('/v0/users/notme');
		});
		it('should return status code 400', () => {
			expect(res.statusCode).toEqual(400);
		});
		it('should return body bad request', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 400,
					message: 'bad request',
				},
			});
		});
	});
	describe('when uuid is not "me" and unknown valid uuid', () => {
		let res;
		const theuuid = randomUUID();
		beforeAll(async () => {
			res = await req(app).get('/v0/users/' + theuuid);
		});
		it('should return status code 404', () => {
			expect(res.statusCode).toEqual(404);
		});
		it('should return body not found', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 404,
					message: 'not found',
					path: '/v0/users/' + theuuid,
				},
			});
		});
	});
	describe('when uuid is not "me" and valid uuid', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).get('/v0/users/' + users[0].uuid);
		});
		it('should return status code 200', () => {
			expect(res.statusCode).toEqual(200);
		});
		it('should return body user.json()', () => {
			expect(res.body).toEqual({
				status: 'ok',
				data: {
					user: users[0].json(),
				},
			});
		});
	});
});
