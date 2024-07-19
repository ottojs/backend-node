// Modules
import express from 'express';
import body_parser from 'body-parser';
import cookie_parser from 'cookie-parser';
import config from './lib/config.js';
import mw from './mw/index.js';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';
import r_csp_report from './routes/csp_report.route.js';
import r_v0 from './routes/v0/index.js';
import r_404 from './routes/404.route.js';

// Initialize Express
const app = express();
app.set('trust proxy', config.IS_PRODUCTION ? 1 : false);

// Protections
app.use(mw.helmet);
app.use(mw.rate_limit);

// Initialize Request
app.use(mw.request_start);

// Special Routes
// No Middleware
app.get('/health', r_health);
app.get('/favicon.ico', function (req, res) {
	return res.status(204).send();
});

// Main Middleware
const body_content_types = ['application/json', 'application/csp-report'];
app.use(body_parser.json({ type: body_content_types }));
app.use(cookie_parser(config.COOKIE_SECRET));
app.use(mw.cors);
app.use(mw.load_browser);
app.use(mw.load_referrer);
app.use(mw.load_utm);
app.use(mw.load_session);
app.use(mw.load_user);
app.use(function (req, res, next) {
	// Mark as heading to routes
	req.appdata.time_routes = Date.now();
	return next();
});

// Attach Routes
app.get('/', r_root);
app.post('/csp-report', r_csp_report);
app.get('/v0/accounts', [mw.require_login, r_v0.accounts_get]);
app.patch('/v0/accounts/:uuid', [mw.require_login, r_v0.accounts_patch_id]);
app.get('/v0/users', r_v0.users_get);
app.get('/v0/users/:uuid', r_v0.users_get_id);
app.post('/v0/users', r_v0.users_post);
app.patch('/v0/users/:uuid', r_v0.users_patch_id);
app.get('/v0/sessions/:uuid', [mw.require_login, r_v0.sessions_get_id]);
app.post('/v0/sessions', r_v0.sessions_post);
app.delete('/v0/sessions/:uuid', [mw.require_login, r_v0.sessions_delete]);
app.get('/v0/tasks', [mw.require_login, r_v0.tasks_get]);
app.post('/v0/tasks', [mw.require_login, r_v0.tasks_post]);
app.patch('/v0/tasks/:uuid', [mw.require_login, r_v0.tasks_patch_id]);
app.delete('/v0/tasks/:uuid', [mw.require_login, r_v0.tasks_delete_id]);
app.post('/v0/upload_url', [mw.require_login, r_v0.upload_url_post]);
app.post('/v0/payments', [r_v0.payments_post]);
app.post('/v0/analytics/sessions', [r_v0.analytics_sessions_post]);
app.patch('/v0/analytics/sessions/:uuid', [r_v0.analytics_sessions_patch_id]);
app.post('/v0/analytics/events', [r_v0.analytics_events_post]);
app.post('/v0/emails', [r_v0.emails_post]);
app.all('*', r_404);

// Error Handler
app.use(mw.error_handler);

// End Middleware
app.use(mw.request_end);

export default app;
