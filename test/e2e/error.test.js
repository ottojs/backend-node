// Modules
import req from 'supertest';
import app from '../../src/index.js';

// Add Error Route for Testing
app.get('/error-temp', function (req, res, next) {
	return next(new Error('unknown error'));
});

describe('GET /error-temp', () => {
	let res;
	beforeAll(async () => {
		res = await req(app).get('/error-temp');
	});
	it('should return status code 500', () => {
		expect(res.statusCode).toEqual(500);
	});
	it('should return "internal server error"', () => {
		expect(res.body).toEqual({
			status: 'error',
			error: {
				code: 500,
				message: 'internal server error',
			},
		});
	});
});
