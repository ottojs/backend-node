// Modules
import req from 'supertest';
import seed from '../data/seed.js';
import app from '../../src/index.js';

describe('POST /csp-report', () => {
	let res;
	beforeAll(async () => {
		await seed.reset();
		res = await req(app)
			.post('/csp-report')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('X-Some-Header', 'SomeValue')
			.send({ some: 'value' });
	});
	it('should store ip, headers, body', async () => {
		const result = await seed.sql.models.csp_report.findOne();
		expect(result).toMatchObject({
			id: 1,
			// TODO: May vary when IPv6 is enabled/disabled or other factors
			//ip: '::ffff:127.0.0.1',
			body_raw: JSON.stringify({ some: 'value' }),
			deleted_at: null,
		});
		console.log('CHECK result.ip', result.ip);
		expect(result.ip).toMatch(/127\.0\.0\.1/);
		expect(result).toHaveProperty('uuid');
		expect(result).toHaveProperty('created_at');
		expect(result).toHaveProperty('updated_at');
		const stored_headers = JSON.parse(result.headers_raw);
		const host_header = stored_headers['host'];
		console.log('CHECK host_header', host_header);
		expect(host_header).toMatch(/127\.0\.0\.1/);
		delete stored_headers['host'];
		expect(stored_headers).toEqual({
			accept: 'application/json',
			'accept-encoding': 'gzip, deflate',
			connection: 'close',
			'content-length': '16',
			'content-type': 'application/json',
			//host: '127.0.0.1:RANDOMPORT',
			'x-some-header': 'SomeValue',
		});
	});
	it('should respond with status code 201', async () => {
		expect(res.statusCode).toEqual(201);
	});
	it('should respond with header Cross-Origin-Resource-Policy => same-site', async () => {
		expect(res.headers).toHaveProperty(
			'cross-origin-resource-policy',
			'same-site'
		);
	});
	it('should respond with body status => created', () => {
		expect(res.body).toEqual({
			status: 'created',
		});
	});
});
