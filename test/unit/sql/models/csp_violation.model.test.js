// Modules
import { randomUUID } from 'node:crypto';
import sql from '../../../../src/sql/index.js';

describe('ModelCSPReport', () => {
	describe('.validate()', () => {
		it('should populate uuid automatically when undefined', () => {
			const report = sql.models.csp_report.build({
				ip: '127.0.0.1',
			});
			expect(report.uuid).toEqual(undefined);
			report.validate();
			expect(typeof report.uuid).toBe('string');
		});
		it('should keep provided uuid', () => {
			const theuuid = randomUUID();
			const report = sql.models.csp_report.build({
				ip: '127.0.0.1',
				uuid: theuuid,
			});
			expect(report.uuid).toEqual(theuuid);
			report.validate();
			expect(report.uuid).toEqual(theuuid);
		});
	});
	describe('.json()', () => {
		it('should only show approved fields', () => {
			const theuuid = randomUUID();
			const thedate = new Date();
			const report = sql.models.csp_report.build({
				id: 100,
				uuid: theuuid,
				ip: '127.0.0.1',
				headers_raw: 'headers',
				body_raw: 'body',
				created_at: thedate,
				updated_at: thedate,
				deleted_at: thedate,
			});
			expect(report.json()).toEqual({
				id: theuuid,
				ip: '127.0.0.1',
				headers_raw: 'headers',
				body_raw: 'body',
				created_at: thedate,
			});
		});
	});
});
