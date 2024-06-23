// Modules
import req from 'supertest';
import seed from '../../data/seed.js';
import app from '../../../src/index.js';

function valid_body() {
	return {
		name_first: 'First',
		name_last: 'Last',
		picture: null,
		color: '#000000', // or 'new'
	};
}

describe('PATCH /v0/users/:uuid', () => {
	let cookies;
	beforeAll(async () => {
		await seed.reset();
		await seed.users();
		cookies = await seed.login('owner@example.com');
	});
	describe('when uuid is not "me"', () => {
		let res;
		beforeAll(async () => {
			res = await req(app).patch('/v0/users/notme');
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
	describe('when uuid is me and logged in', () => {
		it('should return bad request when invalid body', async () => {
			const res = await req(app)
				.patch('/v0/users/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies)
				.send({});
			expect(res.statusCode).toEqual(400);
			expect(res.body).toMatchObject({
				status: 'error',
				error: {
					message: 'bad request',
				},
			});
		});
		it('should update name_first', async () => {
			const body = valid_body();
			body.name_first = 'FirstUpdate';
			const res = await req(app)
				.patch('/v0/users/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies)
				.send(body);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toMatchObject({
				status: 'ok',
				data: {
					user: {
						username: 'owner@example.com',
						name_first: 'FirstUpdate',
						name_last: 'Last',
						picture: null,
					},
				},
			});
		});
		it('should update name_last', async () => {
			const body = valid_body();
			body.name_last = 'LastUpdate';
			const res = await req(app)
				.patch('/v0/users/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies)
				.send(body);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toMatchObject({
				status: 'ok',
				data: {
					user: {
						username: 'owner@example.com',
						name_first: 'First',
						name_last: 'LastUpdate',
						picture: null,
					},
				},
			});
		});
		it('should update picture', async () => {
			const body = valid_body();
			body.picture = 'picture.jpg';
			const res = await req(app)
				.patch('/v0/users/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies)
				.send(body);
			expect(res.statusCode).toEqual(200);
			expect(res.body).toMatchObject({
				status: 'ok',
				data: {
					user: {
						username: 'owner@example.com',
						name_first: 'First',
						name_last: 'Last',
						picture: 'picture.jpg',
					},
				},
			});
		});
		it('should update color', async () => {
			const prior = await req(app)
				.get('/v0/users/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies);
			const body = valid_body();
			body.color = 'new';
			const res = await req(app)
				.patch('/v0/users/me')
				.set('Accept', 'application/json')
				.set('Content-Type', 'application/json')
				.set('Cookie', cookies)
				.send(body);
			expect(res.statusCode).toEqual(200);
			expect(res.body.data.user.color).not.toEqual(prior.body.data.user.color);
		});
	});
});
