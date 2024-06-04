// Modules
import express from 'express';
import r_root from './routes/root.route.js';

// Create Express App
const app = express();

// Attach Routes
app.get('/', r_root);

export default app;
