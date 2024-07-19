// Modules
import { randomUUID } from 'node:crypto';
import debug from 'debug';
const log = debug('app:mw:request_start');

// Run as early as possible to start clock
// Usually as the very first middleware
function mw_request_start(req, res, next) {
	log('start');

	req.appdata = {
		time_start: Date.now(),
		method: req.method,
		path: req.path,
		// Note: A proxy (like a load balancer) will affect this value
		// This is why we set "trust proxy" to true when in production
		ip: req.ip,
	};

	// Generate Request ID
	req.appdata.uuid = randomUUID();

	// Default res.locals to empty object
	res.locals = {};

	// DONE
	//log('[MW:REQINIT] APP DATA', req.appdata);
	log('end');
	return next();
}

export default mw_request_start;
