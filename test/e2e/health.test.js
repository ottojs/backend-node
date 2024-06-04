// Modules
import req from 'supertest';
import app from '../../src/index.js';

describe('GET /health', () => {
	let res;
	beforeAll(async () => {
		res = await req(app).get('/health');
	});
	it('should return status code 200', () => {
		expect(res.statusCode).toEqual(200);
	});
	it('should return "ok"', () => {
		expect(res.body).toEqual({
			status: 'ok',
		});
	});
});
