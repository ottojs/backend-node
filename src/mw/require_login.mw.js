// Modules
import debug from 'debug';
const log = debug('app:mw:require_login');

function mw_require_login(req, res, next) {
	if (req.user && req.user.id) {
		log('[MW:REQUIRE_LOGIN] OK');
		return next();
	} else {
		log('[MW:REQUIRE_LOGIN] FAIL');
		return next(new Error('unauthorized'));
	}
}

export default mw_require_login;
