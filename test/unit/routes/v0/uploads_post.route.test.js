// Modules
import { randomUUID } from 'node:crypto';
import config from '../../../../src/lib/config.js';
import r_v0_uploads_post from '../../../../src/routes/v0/uploads_post.route.js';

function new_req() {
	return {
		params: {
			uuid: randomUUID(),
		},
		user: {},
		body: {
			extension: 'png',
		},
	};
}

function new_res() {
	return {
		setHeader: () => {},
		status: () => {},
		json: () => {},
	};
}

describe('r_v0_uploads_post()', () => {
	describe('when missing extension', () => {
		it('should call next with error 400 bad request', (done) => {
			const req = new_req();
			delete req.body.extension;
			const res = new_res();
			r_v0_uploads_post(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when invalid extension', () => {
		it('should call next with error 400 bad request', (done) => {
			const req = new_req();
			req.body.extension = 'e';
			const res = new_res();
			r_v0_uploads_post(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when unsupported extension', () => {
		it('should call next with error 400 bad request', (done) => {
			const req = new_req();
			req.body.extension = 'exe';
			const res = new_res();
			r_v0_uploads_post(req, res, (e) => {
				expect(e.message).toEqual('bad_request');
				done();
			});
		});
	});
	describe('when valid extension', () => {
		it('should respond with status code 201', (done) => {
			const req = new_req();
			const res = new_res();
			let status = 0;
			res.status = (s) => {
				status = s;
			};
			r_v0_uploads_post(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(status).toEqual(201);
				done();
			});
		});
		it('should return array of user accounts json() with api wrapper', (done) => {
			const req = new_req();
			const res = new_res();
			let json = {};
			res.json = (j) => {
				json = j;
			};
			r_v0_uploads_post(req, res, (e) => {
				expect(e).toEqual(undefined);
				expect(json).toEqual({
					status: 'created',
					data: {
						// 'ccf951b7-2ee5-4285-bf48-73c7816bb549-1719106177280.png'
						filename: json.data.filename,
						filepath: 'content/image/' + json.data.filename,
						mime: 'image/png',
						url:
							config.GCP_BUCKET_NAME +
							'-content/image/' +
							json.data.filename +
							'-v4',
					},
				});
				done();
			});
		});
		it('should call next with undefined', (done) => {
			const req = new_req();
			const res = new_res();
			r_v0_uploads_post(req, res, done);
		});
	});
});
