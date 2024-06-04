// Modules
import mw_load_referrer from '../../../src/mw/load_referrer.mw.js';

function new_req() {
	return {
		headers: {
			referer: 'https://www.example.com/page/thing.html',
		},
		query: {},
		appdata: {
			time_start: Date.now() - 5000,
		},
	};
}

describe('mw_load_referrer()', () => {
	describe('when referer header is not present', () => {
		it('should set req.appdata.referrer to "organic"', (done) => {
			const req = new_req();
			delete req.headers.referer;
			mw_load_referrer(req, {}, () => {
				expect(req.appdata).toHaveProperty('referrer');
				expect(req.appdata.referrer).toEqual({
					source: 'organic',
				});
				done();
			});
		});
	});
	describe('when referer header is set but not a valid uri', () => {
		it('should set req.appdata.referrer to "organic"', (done) => {
			const req = new_req();
			req.headers.referer = 'invalid';
			mw_load_referrer(req, {}, () => {
				expect(req.appdata).toHaveProperty('referrer');
				expect(req.appdata.referrer).toEqual({
					source: 'organic',
				});
				done();
			});
		});
	});
	describe('when referer header is set and a valid domain', () => {
		it('should set req.appdata.referrer', (done) => {
			const req = new_req();
			mw_load_referrer(req, {}, () => {
				expect(req.appdata).toHaveProperty('referrer');
				expect(req.appdata.referrer).toEqual({
					domain: 'www.example.com',
					raw: 'https://www.example.com/page/thing.html',
					source: 'referral',
				});
				done();
			});
		});
	});
	it('should call next()', (done) => {
		mw_load_referrer(new_req(), {}, done);
	});
});
