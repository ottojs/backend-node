describe('Sanity Check', () => {
	it('should set NODE_ENV to "test"', () => {
		// Having Issues with this test? Run below command
		// Windows: Remove-Item Env:\NODE_ENV
		// Linux/macOS/UNIX: unset NODE_ENV;
		expect(process.env.NODE_ENV).toBe('test');
	});
});
