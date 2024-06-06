// Modules
import config from './config.js';

export function cookie_settings(time) {
	const settings = {
		// domain: 'example.com',
		// When not specified, defaults to / usually
		path: '/',
		// "maxAge" is preferred instead of "expires"
		// "expires" will probably be calculated if maxAge is provided
		//expires: false,
		//maxAge: time * 60 * 60 * 1000, // Hours in Milliseconds
		httpOnly: true,
		secure: config.IS_PRODUCTION,
		sameSite: 'Strict', // 'Strict', 'Lax', 'None'
		signed: true,
	};
	if (time !== 'session') {
		settings.maxAge = time * 60 * 60 * 1000; // Hours in Milliseconds
	}
	return settings;
}

export default {
	settings: cookie_settings,
};
