// Modules
import app from '../../src/index.js';

describe('index', () => {
	it('should export an Express application', () => {
		expect(app).toHaveProperty('use');
		expect(app).toHaveProperty('get');
		expect(app).toHaveProperty('post');
		expect(app).toHaveProperty('put');
		expect(app).toHaveProperty('patch');
		expect(app).toHaveProperty('delete');
	});
});
