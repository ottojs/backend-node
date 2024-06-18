// Modules
import { randomUUID } from 'node:crypto';
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('GET /v0/sessions/:uuid', () => {
	let users;
	let cookies_owner;
	let cookies_inactive;
	let session_owner;
	let session_inactive;
	beforeAll(async () => {
		await seed.reset();
		users = await seed.users();
		cookies_owner = await seed.login('owner@example.com');
		// Most Recent Session
		session_owner = await seed.sql.models.session.findOne({
			order: [['id', 'DESC']],
		});
		cookies_inactive = await seed.login('inactive@example.com');
		// Most Recent Session
		session_inactive = await seed.sql.models.session.findOne({
			order: [['id', 'DESC']],
		});
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).get('/v0/sessions/' + randomUUID());
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
	describe('when logged in but uuid is not "me"', () => {
		it('should return 403 forbidden', async () => {
			const res = await req(app)
				.get('/v0/sessions/' + randomUUID())
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_owner);
			expect(res.statusCode).toEqual(403);
			expect(res.body).toMatchObject({
				status: 'error',
				error: {
					message: 'forbidden',
				},
			});
		});
	});
	describe('when logged in and has accounts', () => {
		it('should return session, user, accounts', async () => {
			const res = await req(app)
				.get('/v0/sessions/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_owner);
			expect(res.statusCode).toEqual(200);
			// String is correct but we parse the Date for comparison
			res.body.data.session.created_at = new Date(
				res.body.data.session.created_at
			);
			expect(res.body).toMatchObject({
				status: 'ok',
				data: {
					session: session_owner.json(),
					user: users[1].json(),
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
		it('should return session, user, accounts (empty array)', async () => {
			const res = await req(app)
				.get('/v0/sessions/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies_inactive);
			expect(res.statusCode).toEqual(200);
			// String is correct but we parse the Date for comparison
			res.body.data.session.created_at = new Date(
				res.body.data.session.created_at
			);
			expect(res.body).toEqual({
				status: 'ok',
				data: {
					session: session_inactive.json(),
					user: users[3].json(),
					accounts: [],
				},
			});
		});
	});
});
