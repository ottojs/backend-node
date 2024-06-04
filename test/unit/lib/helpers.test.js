// Modules
import {
	env_required,
	env_default,
	is_valid_environment,
	is_production,
} from '../../../src/lib/helpers.js';

describe('env_required()', () => {
	it('should throw when undefined', () => {
		expect(() => {
			env_required('DOESNOTEXIST');
		}).toThrow(new Error('[ENV] MISSING VARIABLE: DOESNOTEXIST'));
	});
	it('should return the value when defined', () => {
		expect(env_required('NODE_ENV')).toEqual('test');
	});
});

describe('env_default()', () => {
	it('should use default value when undefined', () => {
		expect(env_default('DOESNOTEXIST', 'defaultvalue')).toEqual('defaultvalue');
	});
	it('should use provided value when defined', () => {
		expect(env_default('NODE_ENV', 'defaultvalue')).toEqual('test');
	});
});

describe('is_valid_environment()', () => {
	it('should throw when invalid', () => {
		expect(() => {
			is_valid_environment('local');
		}).toThrow(
			new Error(
				'[ENV] INVALID VARIABLE: NODE_ENV, must be development, test, or production'
			)
		);
	});
	it('should continue when valid', () => {
		expect(() => {
			is_valid_environment('development');
		}).not.toThrow(
			new Error(
				'[ENV] INVALID VARIABLE: NODE_ENV, must be development, test, or production'
			)
		);
	});
});

describe('is_production()', () => {
	it('should return true when production', () => {
		expect(is_production('production')).toEqual(true);
	});
	it('should return false when development, test, etc.', () => {
		expect(is_production('development')).toEqual(false);
	});
});
