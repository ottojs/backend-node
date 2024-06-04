// Modules
import express from 'express';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';
import mw_error_handler from './mw/error_handler.mw.js';

// Create Express App
const app = express();

// Attach Routes
app.get('/', r_root);
app.get('/health', r_health);

// Error Handler
app.use(mw_error_handler);

export default app;
