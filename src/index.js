// Modules
import express from 'express';
import r_root from './routes/root.route.js';
import r_health from './routes/health.route.js';

// Create Express App
const app = express();

// Attach Routes
app.get('/', r_root);
app.get('/health', r_health);

export default app;
