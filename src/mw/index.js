// Modules
import cors from './cors.mw.js';
import error_handler from './error_handler.mw.js';
import helmet from './helmet.mw.js';
import load_browser from './load_browser.mw.js';
import load_referrer from './load_referrer.mw.js';
import load_session from './load_session.mw.js';
import load_user from './load_user.mw.js';
import load_utm from './load_utm.mw.js';
import rate_limit from './rate_limit.mw.js';
import request_early from './request_early.mw.js';
import request_end from './request_end.mw.js';
import request_start from './request_start.mw.js';
import require_key from './require_key.mw.js';
import require_login from './require_login.mw.js';
import require_role from './require_role.mw.js';

export default {
	cors,
	error_handler,
	helmet,
	load_browser,
	load_referrer,
	load_session,
	load_user,
	load_utm,
	rate_limit,
	request_early,
	request_end,
	request_start,
	require_key,
	require_login,
	require_role,
};
