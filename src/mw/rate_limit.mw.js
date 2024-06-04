// Modules
import { rateLimit } from 'express-rate-limit';
import config from '../lib/config.js';

// https://github.com/express-rate-limit/express-rate-limit
// https://express-rate-limit.mintlify.app/reference/configuration
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 100, // Limit each IP to 200 requests per `window` (here, per 5 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Redis, Memcached, etc. See the `Data Stores` section below
	// memory-store by default
	validate: { trustProxy: config.IS_PRODUCTION },
});

export default limiter;
