// Modules
import mw_load_utm from '../../../src/mw/load_utm.mw.js';

function new_req() {
	return {
		headers: {},
		query: {
			utm_source: 'TheSource',
			utm_medium: 'TheMedium',
			utm_campaign: 'TheCampaign',
			utm_content: 'TheContent',
			utm_term: 'TheTerm',
		},
		appdata: {
			time_start: Date.now() - 5000,
		},
	};
}

describe('mw_load_utm()', () => {
	it('should set req.appdata.utm to empty object when utm query params are missing', (done) => {
		const req = new_req();
		req.query = {};
		mw_load_utm(req, {}, () => {
			expect(req.appdata).toHaveProperty('utm', {});
			done();
		});
	});
	it('should set req.appdata.utm with all utm query params present', (done) => {
		const req = new_req();
		mw_load_utm(req, {}, () => {
			expect(req.appdata).toHaveProperty('utm', {
				source: 'TheSource',
				medium: 'TheMedium',
				campaign: 'TheCampaign',
				content: 'TheContent',
				term: 'TheTerm',
			});
			done();
		});
	});
	it('should set req.appdata.utm with one missing utm query param', (done) => {
		const req = new_req();
		delete req.query.utm_term;
		mw_load_utm(req, {}, () => {
			expect(req.appdata).toHaveProperty('utm', {
				source: 'TheSource',
				medium: 'TheMedium',
				campaign: 'TheCampaign',
				content: 'TheContent',
			});
			done();
		});
	});
	it('should call next()', (done) => {
		mw_load_utm(new_req(), {}, done);
	});
});
