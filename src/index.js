// Modules
import express from 'express';
import config from './lib/config.js';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';
import r_404 from './routes/404.route.js';
import mw_helmet from './mw/helmet.mw.js';
import mw_rate_limit from './mw/rate_limit.mw.js';
import mw_error_handler from './mw/error_handler.mw.js';
import mw_request_early from './mw/request_early.mw.js';
import mw_request_start from './mw/request_start.mw.js';
import mw_load_utm from './mw/load_utm.mw.js';
import mw_request_end from './mw/request_end.mw.js';

// Create Express App
const app = express();
app.set('trust proxy', config.IS_PRODUCTION);

// Main Middleware
app.use(mw_request_early);
app.use(mw_helmet);
app.use(mw_rate_limit);
app.use(mw_request_start);
app.use(mw_load_utm);

// Attach Routes
app.get('/', r_root);
app.get('/health', r_health);
app.all('*', r_404);

// Error Handler
app.use(mw_error_handler);

// End Middleware
app.use(mw_request_end);

export default app;
