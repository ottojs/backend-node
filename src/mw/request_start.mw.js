// Modules
import { randomUUID } from 'node:crypto'; // randomBytes
import debug from 'debug';
const log = debug('app:mw:request_start');

function mw_request_start(req, res, next) {
	log('start');

	// Generate Request ID
	req.appdata.uuid = randomUUID();

	// Request Details
	req.appdata.method = req.method;
	req.appdata.path = req.path;
	// Note: A proxy (like a load balancer) will affect this value
	// This is why we set "trust proxy" to true when in production
	req.appdata.ip = req.ip;

	// Default res.locals to empty object
	res.locals = {};

	// Mark as heading to routes
	req.appdata.time_route = Date.now();

	// DONE
	//log('[MW:REQINIT] APP DATA', req.appdata);
	log('end');
	return next();
}

export default mw_request_start;
