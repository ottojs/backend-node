// Modules
import mw_load_browser from '../../../src/mw/load_browser.mw.js';

function new_req() {
	return {
		headers: {
			'user-agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
		},
		query: {},
		appdata: {
			time_start: Date.now() - 5000,
		},
	};
}

describe('mw_load_browser()', () => {
	describe('when user-agent header is not present', () => {
		it('should set req.appdata.ua to empty object', (done) => {
			const req = new_req();
			delete req.headers['user-agent'];
			mw_load_browser(req, {}, () => {
				expect(req.appdata).toHaveProperty('ua', {});
				done();
			});
		});
	});
	describe('when user-agent is set', () => {
		it('should set req.appdata.ua', (done) => {
			const req = new_req();
			mw_load_browser(req, {}, () => {
				expect(req.appdata).toHaveProperty('ua', {
					browser_name: 'Firefox',
					browser_version: '126.0',
					os_name: 'Windows',
					os_version: '10',
					device_name: undefined,
					cpu_arch: 'amd64',
				});
				done();
			});
		});
	});
	it('should call next()', (done) => {
		mw_load_browser(new_req(), {}, done);
	});
});
