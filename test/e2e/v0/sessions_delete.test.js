// Modules
import { randomUUID } from 'node:crypto';
import req from 'supertest';
import config from '../../../src/lib/config.js';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

describe('DELETE /v0/sessions/:uuid', () => {
	let cookies_inactive;
	let thesession;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		cookies_inactive = await seed.login('inactive@example.com');
		// Most Recent Session
		thesession = await seed.sql.models.session.findOne({
			order: [['id', 'DESC']],
		});
	});
	describe('when not logged in', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).delete('/v0/sessions/' + randomUUID());
		});
		it('should return status code 401 unauthorized', () => {
			expect(res.statusCode).toEqual(401);
		});
		it('should return body unauthorized', () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 401,
					message: 'unauthorized',
				},
			});
		});
	});
	describe('when logged in', () => {
		describe('when uuid is not "me"', () => {
			let res;
			beforeAll(async () => {
				res = await req(app)
					.delete('/v0/sessions/' + randomUUID())
					.set('Cookie', cookies_inactive);
			});
			it('should return status code 403 forbidden', () => {
				expect(res.statusCode).toEqual(403);
			});
			it('should return body forbidden', () => {
				expect(res.body).toEqual({
					status: 'error',
					error: {
						code: 403,
						message: 'forbidden',
					},
				});
			});
		});
		describe('when uuid is "me"', () => {
			let res;
			let reload_session;
			beforeAll(async () => {
				res = await req(app)
					.delete('/v0/sessions/me')
					.set('Cookie', cookies_inactive);
				reload_session = await seed.sql.models.session.findOne({
					where: {
						id: thesession.id,
					},
					paranoid: false,
				});
			});
			it('should delete the session', () => {
				expect(reload_session).toHaveProperty('deleted_reason', 'manual');
				expect(reload_session).toHaveProperty('deleted_at');
				expect(reload_session.deleted_at).not.toEqual(null);
			});
			it('should return status code 200 ok', () => {
				expect(res.statusCode).toEqual(200);
			});
			it('should delete the cookie', () => {
				expect(res.headers['set-cookie']).toEqual([
					`${config.COOKIE_NAME_SESSION}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
				]);
			});
			it('should return body session.json()', () => {
				// String is correct but we parse the Date for comparison
				res.body.data.session.created_at = new Date(
					res.body.data.session.created_at
				);
				expect(res.body).toEqual({
					status: 'ok',
					data: {
						session: reload_session.json(),
					},
				});
			});
		});
	});
});
