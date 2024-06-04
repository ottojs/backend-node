// Modules
import debug from 'debug';
const log = debug('app:mw:request_end');

function mw_request_end(req, res, next) {
	req.appdata.time_end = Date.now();
	req.appdata.time_total = req.appdata.time_end - req.appdata.time_start;
	req.appdata.time_total_routes =
		req.appdata.time_end - req.appdata.time_routes;
	log(
		'LOG REQUEST SUCCESSFUL',
		req.appdata.time_total,
		'ms',
		req.appdata.time_total_routes
	);

	return next();
}

export default mw_request_end;