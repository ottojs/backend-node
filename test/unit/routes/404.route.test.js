// Modules
import r_404 from '../../../src/routes/404.route.js';

describe('r_404()', () => {
	describe('when the response was sent', () => {
		it('should call next with undefined', (done) => {
			const res = {
				writableEnded: true,
			};
			r_404({}, res, done);
		});
	});
	describe('when the response was not sent', () => {
		it('should call next with error', (done) => {
			const res = {
				writableEnded: false,
			};
			r_404({}, res, (err) => {
				expect(err).toHaveProperty('message', 'not_found');
				done();
			});
		});
	});
});
