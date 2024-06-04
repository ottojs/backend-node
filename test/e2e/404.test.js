// Modules
import req from 'supertest';
import app from '../../src/index.js';

describe('GET /does-not-exist', () => {
	let res;
	beforeAll(async () => {
		res = await req(app).get('/does-not-exist');
	});
	it('should return status code 404', () => {
		expect(res.statusCode).toEqual(404);
	});
	it('should return "not found"', () => {
		expect(res.body).toEqual({
			status: 'error',
			error: {
				code: 404,
				message: 'not found',
				path: '/does-not-exist',
			},
		});
	});
});
