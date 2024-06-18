// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../src/sql/index.js';
import config from '../../../src/lib/config.js';
import cookie from '../../../src/lib/cookie.js';
import seed from '../../data/seed.js';
import mw_load_session from '../../../src/mw/load_session.mw.js';

describe('mw_load_session()', () => {
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
	});
	describe('when no cookies', () => {
		it('should set req.session to blank session', async () => {
			const req = {};
			await mw_load_session(req, {}, function () {});
			expect(req.session).toEqual({
				id: 0,
				user_id: 0,
			});
		});
	});
	describe('when regular cookie', () => {
		it('should set req.session to blank session', async () => {
			const req = {
				cookies: {},
			};
			req.cookies[cookie.COOKIE_NAME_SESSION] = 'value';
			await mw_load_session(req, {}, function () {});
			expect(req.session).toEqual({
				id: 0,
				user_id: 0,
			});
		});
	});
	describe('when signed cookie but invalid session', () => {
		it('should set req.session to blank session', async () => {
			const req = {
				signedCookies: {},
			};
			req.signedCookies[config.COOKIE_NAME_SESSION] = 'value';
			await mw_load_session(req, {}, function () {});
			expect(req.session).toEqual({
				id: 0,
				user_id: 0,
			});
		});
	});
	describe('when signed cookie and valid session', () => {
		it('should set req.session to the session', async () => {
			// Create Session
			const theuuid = randomUUID();
			const thedate = new Date();
			await sql.models.session.create({
				uuid: theuuid,
				user_id: 1,
				created_at: thedate,
			});
			const req = {
				signedCookies: {},
			};
			req.signedCookies[config.COOKIE_NAME_SESSION] = theuuid;
			await mw_load_session(req, {}, function () {});
			expect(req.session).toMatchObject({
				id: 1,
				uuid: theuuid,
				user_id: 1,
				max_age: 600,
				deleted_reason: null,
				created_at: thedate,
				deleted_at: null,
			});
		});
	});
});
