// Modules
import cors from 'cors';
import config from '../lib/config.js';
import debug from 'debug';
const log = debug('app:mw:cors');

function corsCheck(origin, callback) {
	//log('ORIGIN', origin);
	if (!origin) {
		//log('OK (NONE)');
		callback(null, true);
	} else if (config.CORS_ALLOWED_ORIGINS.indexOf(origin) !== -1) {
		//log('OK (ORIGIN)');
		callback(null, true);
	} else {
		log('WARNING ORIGIN NOT ALLOWED:', origin);
		callback(new Error('Not allowed by CORS'));
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
