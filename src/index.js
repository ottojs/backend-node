// Modules
import express from 'express';
import body_parser from 'body-parser';
import cookie_parser from 'cookie-parser';
import config from './lib/config.js';
import mw_helmet from './mw/helmet.mw.js';
import mw_rate_limit from './mw/rate_limit.mw.js';
import mw_cors from './mw/cors.mw.js';
import mw_error_handler from './mw/error_handler.mw.js';
import mw_request_early from './mw/request_early.mw.js';
import mw_request_start from './mw/request_start.mw.js';
import mw_load_browser from './mw/load_browser.mw.js';
import mw_load_referrer from './mw/load_referrer.mw.js';
import mw_load_utm from './mw/load_utm.mw.js';
import mw_load_session from './mw/load_session.mw.js';
import mw_load_user from './mw/load_user.mw.js';
import mw_require_login from './mw/require_login.mw.js';
import mw_request_end from './mw/request_end.mw.js';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';
import r_csp_report from './routes/csp_report.route.js';
import r_v0_accounts_get from './routes/v0/accounts_get.route.js';
import r_v0_accounts_patch_id from './routes/v0/accounts_patch_id.route.js';
import r_v0_users_get from './routes/v0/users_get.route.js';
import r_v0_users_get_id from './routes/v0/users_get_id.route.js';
import r_v0_users_post from './routes/v0/users_post.route.js';
import r_v0_users_patch_id from './routes/v0/users_patch_id.route.js';
import r_v0_sessions_get_id from './routes/v0/sessions_get_id.route.js';
import r_v0_sessions_post from './routes/v0/sessions_post.route.js';
import r_v0_sessions_delete from './routes/v0/sessions_delete.route.js';
import r_v0_tasks_get from './routes/v0/tasks_get.route.js';
import r_v0_tasks_post from './routes/v0/tasks_post.route.js';
import r_v0_tasks_patch_id from './routes/v0/tasks_patch_id.route.js';
import r_v0_tasks_delete_id from './routes/v0/tasks_delete_id.route.js';
import r_404 from './routes/404.route.js';

// Initialize Express
const app = express();
app.set('trust proxy', config.IS_PRODUCTION);

// Special Routes
app.get('/health', r_health);

// Main Middleware
app.use(mw_request_early);
app.use(mw_helmet);
app.use(mw_rate_limit);
const body_content_types = ['application/json', 'application/csp-report'];
app.use(body_parser.json({ type: body_content_types }));
app.use(cookie_parser(config.COOKIE_SECRET));
app.use(mw_cors);
app.use(mw_request_start);
app.use(mw_load_browser);
app.use(mw_load_referrer);
app.use(mw_load_utm);
app.use(mw_load_session);
app.use(mw_load_user);

// Attach Routes
app.get('/', r_root);
app.post('/csp-report', r_csp_report);
app.get('/v0/accounts', [mw_require_login, r_v0_accounts_get]);
app.patch('/v0/accounts/:uuid', [mw_require_login, r_v0_accounts_patch_id]);
app.get('/v0/users', r_v0_users_get);
app.get('/v0/users/:uuid', r_v0_users_get_id);
app.post('/v0/users', r_v0_users_post);
app.patch('/v0/users/:uuid', r_v0_users_patch_id);
app.get('/v0/sessions/:uuid', [mw_require_login, r_v0_sessions_get_id]);
app.post('/v0/sessions', r_v0_sessions_post);
app.delete('/v0/sessions/:uuid', [mw_require_login, r_v0_sessions_delete]);
app.get('/v0/tasks', [mw_require_login, r_v0_tasks_get]);
app.post('/v0/tasks', [mw_require_login, r_v0_tasks_post]);
app.patch('/v0/tasks/:uuid', [mw_require_login, r_v0_tasks_patch_id]);
app.delete('/v0/tasks/:uuid', [mw_require_login, r_v0_tasks_delete_id]);
app.all('*', r_404);

// Error Handler
app.use(mw_error_handler);

// End Middleware
app.use(mw_request_end);

export default app;
