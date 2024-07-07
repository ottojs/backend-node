// Modules
import debug from 'debug';
const log = debug('app:mw:error_handler');

function mw_error_handler(error, req, res, next) {
	if (error.message === 'bad_request') {
		res.status(400);
		res.json({
			status: 'error',
			error: {
				code: 400,
				message: 'bad request',
			},
		});
	} else if (error.message === 'unauthorized') {
		res.status(401);
		res.json({
			status: 'error',
			error: {
				code: 401,
				message: 'unauthorized',
			},
		});
	} else if (error.message === 'forbidden') {
		res.status(403);
		res.json({
			status: 'error',
			error: {
				code: 403,
				message: 'forbidden',
			},
		});
	} else if (error.message === 'not_found') {
		res.status(404);
		res.json({
			status: 'error',
			error: {
				code: 404,
				message: 'not found',
				path: req.path,
			},
		});
	} else if (error.message === 'not_implemented') {
		res.status(501);
		res.json({
			status: 'error',
			error: {
				code: 501,
				message: 'not implemented',
			},
		});
	} else {
		log('[ERROR HANDLER UNEXPECTED] 500', error);
		res.status(500);
		res.json({
			status: 'error',
			// For security, we do not pass in the error here to prevent data leakage
			error: {
				code: 500,
				message: 'internal server error',
			},
		});
	}
	return next();
}

export default mw_error_handler;
