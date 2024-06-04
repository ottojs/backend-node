// Run as early as possible to start clock
// Usually as the very first middleware
function mw_request_early(req, res, next) {
	req.appdata = {
		time_start: Date.now(),
	};
	return next();
}

export default mw_request_early;
