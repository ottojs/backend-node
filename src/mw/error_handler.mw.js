function mw_error_handler(error, req, res, next) {
	res.status(500);
	res.json({
		status: 'error',
		// For security, we do not pass in the error here to prevent data leakage
		error: {
			code: 500,
			message: 'internal server error',
		},
	});
	return next();
}

export default mw_error_handler;
