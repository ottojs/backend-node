// Modules
//import fs from "node:fs";
import { Sequelize } from 'sequelize';
import debug from 'debug';
const log = debug('app:sql');

// Global Variables
let db = null;
let sequelize = null;
// you can also use "log" function variable or "console.log"
// Using false here because seeing the SQL statements can get noisy
const logger = false;

// Returns a configured Sequelize object
function configure(config) {
	// API Reference
	// Note: The "first parameter is a URI" pattern is not
	//       well-documented and exists only in example section
	// https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor
	const sql = {
		logging: logger,
		pool: {
			max: 10,
			min: 1,
			acquire: 30 * 1000,
			idle: 10 * 1000,
		},
		ssl: true,
		//dialect: 'postgres',
		dialectOptions: {
			// These are usually defaulted for PostgreSQL or in the URI
			// socketPath: '/run/postgresql/.s.PGSQL.5432',
			// port: 5432,
			//
			// for PostgreSQL, you can also specify an absolute path
			// to a directory containing a UNIX socket to connect
			// host: '/sockets/psql_sockets'.
			ssl: {
				require: true,
				rejectUnauthorized: true,
				// Are you using client certificates? If so, you'll need these
				// NOTE: These file paths are relative to CWD
				// ca: fs.readFileSync('/path/to/client-certificates/client.crt').toString(),
				// key: fs.readFileSync('/path/to/client-key/postgresql.key').toString(),
				// cert: fs.readFileSync('/path/to/client-certificates/postgresql.crt').toString(),
			},
		},
	};

	if (config.SQL_URI === 'sqlite::memory:') {
		// SQLite (in-memory, if you really want file-based use SQL_URI)
		log('[SQL] Using SQLite Memory');
		sql.dialect = 'sqlite';
		sql.storage = ':memory:';
		return new Sequelize(sql);
	} else {
		// Normal SQL_URI
		log('[SQL] USING GIVEN ENV VAR SQL_URI');
		return new Sequelize(config.SQL_URI, sql);
	}
}

// Main Loader
let initialized = false;
async function initialize() {
	log('[SQL] CHECK INITIALIZED...');
	if (initialized === true) {
		return db;
	}
	initialized = true;
	log('[SQL] INITIALIZING...');

	// Configured Sequelize object
	// TODO: May swap process.env for config file
	//       but that may create more clutter
	sequelize = configure(process.env);

	// Connect to Database
	db = await connect(sequelize);

	// Using Migrations is recommended... but this option is available
	// WARNING: Use at your own peril
	await sequelize.sync();
	return db;
}

function reset() {
	initialized = false;
	sequelize = null;
	db = null;
}

async function connect(sequelize_obj) {
	log('[SQL] CONNECTING...');
	try {
		await sequelize_obj.authenticate();
		log('[SQL] CONNECTED!!!');
		// Close Connection
		// await sequelize.close();
		return sequelize_obj;
	} catch (error) {
		// TODO: This is fine to exit on DB failure but
		//       could be handled gracefully in the future
		// Exit on Error
		// error.original, error.parent
		log('[SQL] CONNECTION FAILED:', error.original);
		throw error;
	}
}

// Initialize
await initialize();

// Exported for testing purposes
// Recommendation is to only use the default export
export { configure, initialize, connect, reset };
export default {
	_sequelize: sequelize,
	_db: db,
};
