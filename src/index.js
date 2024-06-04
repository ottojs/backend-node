// Modules
import express from 'express';
import config from './lib/config.js';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';
import r_404 from './routes/404.route.js';
import mw_helmet from './mw/helmet.mw.js';
import mw_rate_limit from './mw/rate_limit.mw.js';
import mw_error_handler from './mw/error_handler.mw.js';

// Create Express App
const app = express();

// Main Middleware
app.set('trust proxy', config.IS_PRODUCTION);
app.use(mw_helmet);
app.use(mw_rate_limit);

// Attach Routes
app.get('/', r_root);
app.get('/health', r_health);
app.all('*', r_404);

// Error Handler
app.use(mw_error_handler);

export default app;
