// Modules
import { randomUUID } from 'node:crypto';
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('PATCH /v0/accounts/:uuid', () => {
	let users;
	let cookies_owner;
	let cookies_member;
	let cookies_inactive;
	beforeAll(async () => {
		await seed.reset();
		users = await seed.users();
		cookies_owner = await seed.login('owner@example.com');
		cookies_member = await seed.login('normal@example.com');
		cookies_inactive = await seed.login('inactive@example.com');
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).patch('/v0/accounts/' + randomUUID());
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
		describe('when uuid is not valid', () => {
			it('should return bad request', async () => {
				const res = await req(app)
					.patch('/v0/accounts/notvalid')
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.set('Cookie', cookies_member)
					.send({});
				expect(res.statusCode).toEqual(400);
				expect(res.body).toMatchObject({
					status: 'error',
					error: {
						message: 'bad request',
					},
				});
			});
		});
		describe('when uuid does not match account', () => {
			it('should return bad request', async () => {
				const res = await req(app)
					.patch('/v0/accounts/' + randomUUID())
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.set('Cookie', cookies_member)
					.send({});
				expect(res.statusCode).toEqual(403);
				expect(res.body).toMatchObject({
					status: 'error',
					error: {
						message: 'forbidden',
					},
				});
			});
		});
		describe('when logged in user is not owner', () => {
			it('should return forbidden', async () => {
				const res = await req(app)
					.patch('/v0/accounts/' + users[1].ModelAccounts[0].uuid)
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.set('Cookie', cookies_member)
					.send({});
				expect(res.statusCode).toEqual(403);
				expect(res.body).toMatchObject({
					status: 'error',
					error: {
						message: 'forbidden',
					},
				});
			});
		});
		describe('when logged in user is owner but invalid body', () => {
			it('should return 400 bad request', async () => {
				const res = await req(app)
					.patch('/v0/accounts/' + users[1].ModelAccounts[0].uuid)
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.set('Cookie', cookies_owner)
					.send({});
				expect(res.statusCode).toEqual(400);
				expect(res.body).toMatchObject({
					status: 'error',
					error: {
						message: 'bad request',
					},
				});
			});
		});
		describe('when logged in user is owner and all is valid', () => {
			it('should return 200 ok', async () => {
				const res = await req(app)
					.patch('/v0/accounts/' + users[1].ModelAccounts[0].uuid)
					.set('Accept', 'application/json')
					.set('Content-Type', 'application/json')
					.set('Cookie', cookies_owner)
					.send({
						name: 'Updated Name',
					});
				expect(res.statusCode).toEqual(200);
				expect(res.body).toMatchObject({
					status: 'ok',
				});
			});
		});
	});
	describe('when logged in with zero accounts', () => {
		it('should return 400 bad request', async () => {
			const res = await req(app)
				.patch('/v0/accounts/' + randomUUID())
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_inactive)
				.send({});
			expect(res.statusCode).toEqual(400);
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 400,
					message: 'bad request',
				},
			});
		});
	});
});
