// Modules
import sql from '../src/sql/index.js';

beforeAll(async () => {
	// SYNCING MODELS FOR TEST IN SQLITE
	await sql._sequelize.sync();
});

afterAll(async () => {
	// Close Database Connection
	await sql._db.close();
});
