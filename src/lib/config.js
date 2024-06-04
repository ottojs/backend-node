// Modules
import {
	env_required,
	env_default,
	is_valid_environment,
	is_production,
} from './helpers.js';

// MAIN ENVIRONMENT
const NODE_ENV = env_required('NODE_ENV');

// Load Required Variables
const LISTEN = env_default('LISTEN', '0.0.0.0');
const PORT = parseInt(env_default('PORT', '8080'), 10);

// Valid Environment Check
is_valid_environment(NODE_ENV);

// Production Environment Check
const IS_PRODUCTION = is_production(NODE_ENV);

export default {
	NODE_ENV,
	LISTEN,
	PORT,
	// Calculated
	IS_PRODUCTION,
};
