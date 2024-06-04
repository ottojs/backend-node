// Modules
import req from 'supertest';
import express from 'express';
import mw_error_handler from '../../src/mw/error_handler.mw.js';

// Add Error Route for Testing
// We create a new express app because editing the stack is difficult
// This is a special scenario. Generally you should load app from src/index.js
const app = express();
app.get('/error-temp', function (req, res, next) {
	return next(new Error('unknown error'));
});
app.use(mw_error_handler);

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
