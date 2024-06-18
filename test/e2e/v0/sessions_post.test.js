// Modules
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

function valid_body() {
	return {
		username: 'owner@example.com',
		password: 'testingpass',
	};
}

describe('POST /v0/sessions', () => {
	let users;
	beforeAll(async () => {
		await seed.reset();
		users = await seed.users();
	});
	describe('when body is missing params', () => {
		let res;
		beforeAll(async () => {
			res = await req(app)
				.post('/v0/sessions')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send({});
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
	describe('when username is not found', () => {
		let res;
		beforeAll(async () => {
			const body = valid_body();
			body.username = 'none@example.com';
			res = await req(app)
				.post('/v0/sessions')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(body);
		});
		it('should return status code 403', () => {
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
	describe('when password is not correct', () => {
		let res;
		beforeAll(async () => {
			const body = valid_body();
			body.password = 'doesnotwork';
			res = await req(app)
				.post('/v0/sessions')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(body);
		});
		it('should return status code 403', () => {
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
	describe('when username/password is correct', () => {
		let res;
		let thesession;
		beforeAll(async () => {
			const body = valid_body();
			res = await req(app)
				.post('/v0/sessions')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.send(body);
			// Most Recent Session
			thesession = await seed.sql.models.session.findOne({
				order: [['id', 'DESC']],
			});
		});
		it('should return status code 201', () => {
			expect(res.statusCode).toEqual(201);
		});
		it('should set cookie', () => {
			expect(res.headers['set-cookie']).toHaveLength(1);
			const c = res.headers['set-cookie'][0];
			expect(c).toMatch(/Max-Age=28800;/);
			expect(c).toMatch(/Path=\/;/);
			expect(c).toMatch(/HttpOnly;/);
			expect(c).toMatch(/SameSite=Strict/);
		});
		it('should return body with session and user', () => {
			// String is correct but we parse the Date for comparison
			res.body.data.session.created_at = new Date(
				res.body.data.session.created_at
			);
			expect(res.body).toEqual({
				status: 'created',
				data: {
					session: thesession.json(),
					user: users[1].json(),
				},
			});
		});
	});
});
