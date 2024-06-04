// Modules
import req from 'supertest';
import app from '../../src/index.js';

describe('Rate Limit', () => {
	let res;
	beforeAll(async () => {
		res = await req(app).get('/');
	});
	it('should return ratelimit headers (draft-7 format)', () => {
		expect(res.headers).toHaveProperty('ratelimit');
		expect(res.headers.ratelimit).toMatch(
			/limit=100, remaining=[0-9]{2}, reset=300/
		);
		expect(res.headers).toHaveProperty('ratelimit-policy', '100;w=300');
	});
});
