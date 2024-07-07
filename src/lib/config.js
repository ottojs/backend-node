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
const SQL_URI = env_required('SQL_URI');

// Valid Environment Check
is_valid_environment(NODE_ENV);

// Production Environment Check
const IS_PRODUCTION = is_production(NODE_ENV);

// Cookies
const COOKIE_SECRET = env_required('COOKIE_SECRET');
const COOKIE_NAME_SESSION = 'sid';

// CORS
const CORS_ALLOWED_ORIGINS = env_default(
	'CORS_ALLOWED_ORIGINS',
	['http://localhost:3000', 'http://localhost:8081'].join(',')
).split(',');

// Email - General
const EMAIL_PROVIDER = env_default('EMAIL_PROVIDER', 'preview');

// Email - SendGrid
const EMAIL_SENDGRID_API_KEY = env_default(
	'EMAIL_SENDGRID_API_KEY',
	'disabled'
);
let sendgrid = 'disabled';
if (EMAIL_SENDGRID_API_KEY !== 'disabled') {
	sendgrid = {
		from_name: 'SendGrid App',
		from_email: 'alert@sendgrid.example.com',
		reply_to: 'help@example.com',
	};
}

// Google Cloud Config
const GCP_STORAGE_CONFIG = JSON.parse(env_default('GCP_STORAGE_CONFIG', '{}'));
const GCP_BUCKET_NAME = env_default('GCP_BUCKET_NAME', 'example-bucket');
const GCP_UPLOAD_EXPIRE_TIME = 5 * 60 * 1000; // 5 minutes in seconds

// Register Code
const REGISTER_CODE = env_default('REGISTER_CODE', '1234');

export default {
	NODE_ENV,
	LISTEN,
	PORT,
	SQL_URI,
	COOKIE_SECRET,
	COOKIE_NAME_SESSION,
	CORS_ALLOWED_ORIGINS,
	// Email
	EMAIL_PROVIDER,
	EMAIL_SENDGRID_API_KEY,
	sendgrid,
	// Google Cloud
	GCP_STORAGE_CONFIG,
	GCP_BUCKET_NAME,
	GCP_UPLOAD_EXPIRE_TIME,
	REGISTER_CODE,
	// Calculated
	IS_PRODUCTION,
};
