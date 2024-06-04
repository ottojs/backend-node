// Modules
import { UAParser } from 'ua-parser-js';
import debug from 'debug';
const log = debug('app:mw:browser');

// Note: This information is an estimate and not reliable
function mw_load_browser(req, res, next) {
	log('start');

	req.appdata.ua = {};
	const useragentstr = req.headers['user-agent'];
	if (useragentstr !== undefined && useragentstr !== '') {
		const ua = UAParser(useragentstr);
		// 2024-06-04
		//
		// Firefox - Windows 11
		// {
		// 	ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
		// 	browser: { name: 'Firefox', version: '126.0', major: '126' },
		// 	engine: { name: 'Gecko', version: '126.0' },
		// 	os: { name: 'Windows', version: '10' },
		// 	device: { vendor: undefined, model: undefined, type: undefined },
		// 	cpu: { architecture: 'amd64' }
		// }
		//
		// Chrome - Windows 11
		// {
		// 	ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
		// 	browser: { name: 'Chrome', version: '125.0.0.0', major: '125' },
		// 	engine: { name: 'Blink', version: '125.0.0.0' },
		// 	os: { name: 'Windows', version: '10' },
		// 	device: { vendor: undefined, model: undefined, type: undefined },
		// 	cpu: { architecture: 'amd64' }
		// }
		req.appdata.ua.browser_name = ua.browser.name;
		req.appdata.ua.browser_version = ua.browser.version;
		req.appdata.ua.device_name = ua.device.model;
		req.appdata.ua.os_name = ua.os.name;
		req.appdata.ua.os_version = ua.os.version;
		req.appdata.ua.cpu_arch = ua.cpu.architecture;
	}

	log('end');
	next();
}

export default mw_load_browser;
