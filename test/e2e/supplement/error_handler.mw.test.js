// Modules
import express from 'express';
import request from 'supertest';
import mw_error_handler from '../../../src/mw/error_handler.mw.js';

describe('Error Handler', () => {
	describe('400 Bad Request', () => {
		let res;
		beforeAll(async () => {
			const app = express();
			app.use(function (req, res, next) {
				return next(new Error('bad_request'));
			});
			app.use(mw_error_handler);
			res = await request(app).get('/anything');
		});
		it('should respond with 400 status code', async () => {
			expect(res.statusCode).toEqual(400);
		});
		it('should respond with error bad request', async () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 400,
					message: 'bad request',
				},
			});
		});
	});
	describe('401 Unauthorized', () => {
		let res;
		beforeAll(async () => {
			const app = express();
			app.use(function (req, res, next) {
				return next(new Error('unauthorized'));
			});
			app.use(mw_error_handler);
			res = await request(app).get('/anything');
		});
		it('should respond with 401 status code', async () => {
			expect(res.statusCode).toEqual(401);
		});
		it('should respond with error unauthorized', async () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 401,
					message: 'unauthorized',
				},
			});
		});
	});
	describe('403 Forbidden', () => {
		let res;
		beforeAll(async () => {
			const app = express();
			app.use(function (req, res, next) {
				return next(new Error('forbidden'));
			});
			app.use(mw_error_handler);
			res = await request(app).get('/anything');
		});
		it('should respond with 403 status code', async () => {
			expect(res.statusCode).toEqual(403);
		});
		it('should respond with error forbidden', async () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 403,
					message: 'forbidden',
				},
			});
		});
	});
	describe('404 Not Found', () => {
		let res;
		beforeAll(async () => {
			const app = express();
			app.use(function (req, res, next) {
				return next(new Error('not_found'));
			});
			app.use(mw_error_handler);
			res = await request(app).get('/anything');
		});
		it('should respond with 404 status code', async () => {
			expect(res.statusCode).toEqual(404);
		});
		it('should respond with error not found', async () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 404,
					message: 'not found',
					path: '/anything',
				},
			});
		});
	});
	describe('500 General Error', () => {
		let res;
		beforeAll(async () => {
			const app = express();
			app.use(function (req, res, next) {
				return next(new Error('unexpected'));
			});
			app.use(mw_error_handler);
			res = await request(app).get('/anything');
		});
		it('should respond with 500 status code', async () => {
			expect(res.statusCode).toEqual(500);
		});
		it('should respond with error internal server error', async () => {
			expect(res.body).toEqual({
				status: 'error',
				error: {
					code: 500,
					message: 'internal server error',
				},
			});
		});
	});
});
