// Modules
import debug from 'debug';
const log = debug('app:mw:load_utm');

const utm_keys = ['source', 'medium', 'campaign', 'content', 'term'];
function mw_load_utm(req, res, next) {
	log('start');

	// UTM Marketing Tracking
	req.appdata.utm = {};
	for (const utmk of utm_keys) {
		if ('utm_' + utmk in req.query) {
			req.appdata.utm[utmk] = req.query['utm_' + utmk];
		}
	}

	log('end');
	return next();
}

export default mw_load_utm;
