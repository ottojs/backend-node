// Modules
import { corsCheck } from '../../../src/mw/cors.mw.js';

describe('CORS corsCheck()', () => {
	it('should allow no origin', () => {
		corsCheck(undefined, (err, allow) => {
			expect(err).toBe(null);
			expect(allow).toBe(true);
		});
	});
	it('should not allow origin empty string', () => {
		corsCheck('', (err, allow) => {
			expect(err).not.toBe(null);
			expect(err.message).toBe('Not allowed by CORS');
			expect(allow).toBe(undefined);
		});
	});
	it('should allow listed origin (exact match)', () => {
		corsCheck('http://localhost:3000', (err, allow) => {
			expect(err).toBe(null);
			expect(allow).toBe(true);
		});
	});
	it('should allow listed origin (prefix match)', () => {
		corsCheck('http://localhost:3000/', (err, allow) => {
			expect(err).toBe(null);
			expect(allow).toBe(true);
		});
	});
	it('should not allow unknown origin', () => {
		corsCheck('https://example.com', (err, allow) => {
			expect(err).not.toBe(null);
			expect(err.message).toBe('Not allowed by CORS');
			expect(allow).toBe(undefined);
		});
	});
});
