// Modules
import cookie from '../../../src/lib/cookie.js';

describe('Cookie library', () => {
	it('should not set maxAge when expiration is session', () => {
		const result = cookie.settings('session');
		expect(result).not.toHaveProperty('maxAge');
		// Shouldn't have this property at any time
		expect(result).not.toHaveProperty('expires');
	});
	it('should set maxAge to 1 hour in milliseconds when expiration is 1 hour', () => {
		const result = cookie.settings(1);
		expect(result).toHaveProperty('maxAge', 3600 * 1000);
		// Shouldn't have this property at any time
		expect(result).not.toHaveProperty('expires');
	});
	it('should set maxAge to 2 hours in milliseconds when expiration is 2 hours', () => {
		const result = cookie.settings(2);
		expect(result).toHaveProperty('maxAge', 7200 * 1000);
		// Shouldn't have this property at any time
		expect(result).not.toHaveProperty('expires');
	});
});
