// Modules
import sql from '../sql/index.js';
import config from '../lib/config.js';
import debug from 'debug';
const log = debug('app:mw:load_session');

// NOTE: There is a difference between req.cookies and req.signedCookies
//       Generally only use req.signedCookies for extra protection
async function mw_load_session(req, res, next) {
	// Default to blank session
	req.session = {
		id: 0,
		user_id: 0,
	};
	if (
		req.signedCookies &&
		req.signedCookies[config.COOKIE_NAME_SESSION] !== undefined
	) {
		const session_id = req.signedCookies[config.COOKIE_NAME_SESSION];
		const session_result = await sql.models.session.findOne({
			where: {
				uuid: session_id,
			},
		});
		if (session_result === null) {
			log('[MW:SESSION:LOAD] NOT FOUND. DEFAULT TO BLANK');
		} else {
			log('[MW:SESSION:LOAD] OK');
			req.session = session_result;
		}
	} else {
		log('[MW:SESSION:LOAD] NO SESSION COOKIE. DEFAULT TO BLANK');
	}
	return next();
}

export default mw_load_session;
