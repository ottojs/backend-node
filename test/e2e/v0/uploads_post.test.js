// Modules
import req from 'supertest';
//import { jest } from '@jest/globals';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('POST /v0/uploadsl', () => {
	let cookies_owner;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		cookies_owner = await seed.login('owner@example.com');
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/uploads')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json');
		});
		it('should return status code 401 unauthorized', () => {
			expect(res.statusCode).toEqual(401);
		});
		it('should return error 401', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 401,
					message: 'unauthorized',
				},
			});
		});
	});
	describe('when logged in and missing extension', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/uploads')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_owner)
				.send({});
		});
		it('should return status code 400', () => {
			expect(res.statusCode).toEqual(400);
		});
		it('should return error 400', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 400,
					message: 'bad request',
				},
			});
		});
	});
	describe('when logged in and invalid extension', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/uploads')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_owner)
				.send({
					extension: 'exe',
				});
		});
		it('should return status code 400', () => {
			expect(res.statusCode).toEqual(400);
		});
		it('should return error 400', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 400,
					message: 'bad request',
				},
			});
		});
	});
	describe('when logged in and valid extension', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/uploads')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_owner)
				.send({
					extension: 'png',
				});
		});
		it('should return status code 201', () => {
			expect(res.statusCode).toEqual(201);
		});
		it('should return url', () => {
			expect(res.body).toHaveProperty('status', 'created');
			expect(res.body).toHaveProperty('data');
			expect(res.body.data).toHaveProperty('url');
		});
	});
});
