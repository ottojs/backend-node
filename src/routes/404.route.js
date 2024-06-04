function r_404(req, res, next) {
	if (res.writableEnded === false) {
		return next(new Error('not_found'));
	}
	return next();
}

export default r_404;
