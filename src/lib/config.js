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
	['http://localhost:3111', 'http://localhost:8081'].join(',')
).split(',');

// Email - General
const EMAIL_PROVIDER = env_default('EMAIL_PROVIDER', 'preview');

// Email - Mailgun
const EMAIL_MAILGUN_API_KEY = env_default('EMAIL_MAILGUN_API_KEY', 'disabled');
let mailgun = 'disabled';
if (EMAIL_MAILGUN_API_KEY !== 'disabled') {
	mailgun = {
		// https://api.eu.mailgun.net
		api_endpoint: 'https://api.mailgun.net',
		domain: 'mailgun.example.com',
		from_name: 'Mailgun App',
		from_email: 'alerts@mailgun.example.com',
		reply_to: 'help@example.com',
	};
}

// Email - Postmark
const EMAIL_POSTMARK_API_KEY = env_default(
	'EMAIL_POSTMARK_API_KEY',
	'disabled'
);
let postmark = 'disabled';
if (EMAIL_POSTMARK_API_KEY !== 'disabled') {
	postmark = {
		stream: 'outbound',
		domain: 'postmark.example.com',
		from_name: 'Postmark App',
		from_email: 'alerts@postmark.example.com',
		reply_to: 'help@example.com',
	};
}

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

// Stripe
const STRIPE_SECRET_KEY = env_default('STRIPE_SECRET_KEY', 'disabled');
const STRIPE_API_VERSION = env_default('STRIPE_API_VERSION', '2024-06-20');
const STRIPE_ONETIME_PRICE_ID = env_default(
	'STRIPE_ONETIME_PRICE_ID',
	'disabled'
);
const STRIPE_SUBSCRIPTION_PRICE_ID = env_default(
	'STRIPE_SUBSCRIPTION_PRICE_ID',
	'disabled'
);

// Register Code
const REGISTER_CODE = env_default('REGISTER_CODE', '1234');

// App Data
const API_DOMAIN = env_default('API_DOMAIN', 'localhost:8080');
const API_URI = env_default('API_URI', `http://${API_DOMAIN}`);
const APP_DOMAIN = env_default('APP_DOMAIN', 'localhost:3111');
const APP_URI = env_default('APP_URI', `http://${APP_DOMAIN}`);

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
	EMAIL_MAILGUN_API_KEY,
	EMAIL_POSTMARK_API_KEY,
	EMAIL_SENDGRID_API_KEY,
	mailgun,
	postmark,
	sendgrid,
	// Google Cloud
	GCP_STORAGE_CONFIG,
	GCP_BUCKET_NAME,
	GCP_UPLOAD_EXPIRE_TIME,
	// Stripe
	STRIPE_SECRET_KEY,
	STRIPE_API_VERSION,
	STRIPE_ONETIME_PRICE_ID,
	STRIPE_SUBSCRIPTION_PRICE_ID,
	// App
	API_DOMAIN,
	API_URI,
	APP_DOMAIN,
	APP_URI,
	REGISTER_CODE,
	// Calculated
	IS_PRODUCTION,
};
