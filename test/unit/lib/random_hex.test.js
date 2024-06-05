// Modules
import random_hex from '../../../src/lib/random_hex.js';

describe('random_hex()', () => {
	it('should generate a random hex with prefixed hash', () => {
		const hex1 = random_hex();
		const hex2 = random_hex();
		expect(hex1).not.toEqual(hex2);
		const regex = /\#[A-F0-9]{6}/;
		expect(hex1).toMatch(regex);
		expect(hex2).toMatch(regex);
	});
});
