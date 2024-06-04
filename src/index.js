// Modules
import express from 'express';
import config from './lib/config.js';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';
import r_404 from './routes/404.route.js';
import mw_error_handler from './mw/error_handler.mw.js';

console.log('NODE_ENV', config.NODE_ENV);

// Create Express App
const app = express();

// Attach Routes
app.get('/', r_root);
app.get('/health', r_health);
app.all('*', r_404);

// Error Handler
app.use(mw_error_handler);

export default app;
