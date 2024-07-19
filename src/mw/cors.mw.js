// Modules
import _ from 'lodash';
import cors from 'cors';
import config from '../lib/config.js';
import debug from 'debug';
const log = debug('app:mw:cors');

function corsCheck(origin, callback) {
	//log('ORIGIN', origin);
	let allowed = false;
	if (_.isUndefined(origin)) {
		// No Origin. Allowed
		//log('OK NO ORIGIN');
		allowed = true;
	} else {
		if (_.isString(origin) && origin.length > 0) {
			config.CORS_ALLOWED_ORIGINS.map((o) => {
				if (origin.startsWith(o)) {
					//log('OK ORIGIN FOUND: ' + origin + ':' + o);
					allowed = true;
				}
			});
		}
	}

	if (allowed === true) {
		//log('OK ORIGIN ALLOWED: ' + origin);
		callback(null, true);
	} else {
		log('WARNING ORIGIN NOT ALLOWED: ' + origin);
		callback(new Error('forbidden'));
	}
}

const corsOptions = {
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	// Allows Cookies
	allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
	exposedHeaders: ['Content-Type', 'Set-Cookie'],
	// Required for Passing Cookies
	// TODO: Set credentials ONLY on paths where needed
	credentials: true,
	maxAge: 3600,
	origin: corsCheck,
};

export { corsCheck, corsOptions };
export default cors(corsOptions);
