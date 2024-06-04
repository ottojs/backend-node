// Modules
import _ from 'lodash';

function env_required(key) {
	if (process.env[key] === undefined || process.env[key] === '') {
		throw new Error('[ENV] MISSING VARIABLE: ' + key);
	}
	const value = process.env[key];
	return value;
}

function env_default(key, default_val) {
	let value = process.env[key];
	if (process.env[key] === undefined || process.env[key] === '') {
		value = default_val;
	}
	return value;
}

// Valid Environment Check
function is_valid_environment(NODE_ENV) {
	// https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
	// https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
	const valid_envs = ['development', 'test', 'production'];
	if (_.indexOf(valid_envs, NODE_ENV) === -1) {
		throw new Error(
			'[ENV] INVALID VARIABLE: NODE_ENV, must be development, test, or production'
		);
	}
}

function is_production(NODE_ENV) {
	return NODE_ENV === 'production';
}

export { env_required, env_default, is_valid_environment, is_production };
