// Modules
import {
	configure,
	initialize,
	connect,
	reset,
} from '../../../src/sql/index.js';

describe('SQL', () => {
	afterAll(() => {
		reset();
	});
	describe('initialize()', () => {
		describe('when initilzied multiple times', () => {
			it('should do nothing and return the same object', async () => {
				const instance1 = await initialize();
				const instance2 = await initialize();
				expect(instance1).toBe(instance2);
			});
		});
	});
	describe('configure()', () => {
		describe('when SQL_URI is SQLite', () => {
			it('should return Sequelize object with URI', () => {
				const result = configure({
					SQL_URI: 'sqlite::memory:',
				});
				expect(result.config).toMatchObject({
					password: null,
					host: 'localhost',
					ssl: true,
					pool: { max: 10, min: 1, acquire: 30000, idle: 10000 },
				});
			});
		});
		describe('when only using SQL_URI', () => {
			it('should return Sequelize object with URI', () => {
				const result = configure({
					// https://www.postgresql.org/docs/16/libpq-connect.html#LIBPQ-CONNSTRING-URIS
					SQL_URI:
						'postgresql://someuser:somepass@somehost:1234/somedb?sslmode=require&ssl_min_protocol_version=TLSv1.2',
				});
				expect(result.config).toMatchObject({
					database: 'somedb',
					username: 'someuser',
					password: 'somepass',
					host: 'somehost',
					port: '1234',
					ssl: true,
					pool: { max: 10, min: 1, acquire: 30000, idle: 10000 },
					dialectOptions: {
						ssl: {
							// TODO: Likely a bug somewhere that this is not set
							//rejectUnauthorized: true,
						},
						sslmode: 'require',
						user: 'someuser',
						password: 'somepass',
						host: 'somehost',
						port: '1234',
						database: 'somedb',
					},
				});
			});
		});
	});
	describe('connect()', () => {
		describe('when given incorrect credentials', () => {
			it('should throw an error', async () => {
				reset();
				const sequelize = configure({
					SQL_URI: 'postgres://wont:work@localhost/db',
				});
				// "The server does not support SSL connections"
				// "connect ECONNREFUSED 127.0.0.1:5432"
				await expect(connect(sequelize)).rejects.toThrow();
			});
		});
	});
});
