// Modules
import debug from 'debug';
const log = debug('app:mw:mw_require_key');

function mw_require_key_init(k, v) {
	return function mw_require_key(req, res, next) {
		log('[MW:REQUIRE_KEY]', req.query);
		if (req.query && req.query[k] === v) {
			log('[MW:REQUIRE_KEY] OK');
			return next();
		} else {
			log('[MW:REQUIRE_KEY] FAIL');
			return next(new Error('unauthorized'));
		}
	};
}

export default mw_require_key_init;
