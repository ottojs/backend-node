// Modules
import debug from 'debug';
const log = debug('app:mw:require_role');

function mw_require_role_init(role) {
	return function mw_require_role(req, res, next) {
		if (req.user && req.user.ModelAccounts && req.user.ModelAccounts[0]) {
			if (req.user.ModelAccounts[0].roles.indexOf(role) !== -1) {
				log('[MW:REQUIRE_ROLE] OK');
				return next();
			}
		}
		log('[MW:REQUIRE_ROLE] FAIL');
		return next(new Error('forbidden'));
	};
}

export default mw_require_role_init;
