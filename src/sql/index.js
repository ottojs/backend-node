// Modules
//import fs from "node:fs";
import { Sequelize } from 'sequelize';
import ModelRequestLog from './models/request_log.model.js';
import ModelCSPReport from './models/csp_report.model.js';
import ModelAccount from './models/account.model.js';
import ModelUser from './models/user.model.js';
import ModelJoinAccountUser from './models/join_account_user.model.js';
import ModelSession from './models/session.model.js';
import ModelTask from './models/task.model.js';
import ModelAnalyticsSession from './models/analytics_session.model.js';
import ModelAnalyticsEvent from './models/analytics_event.model.js';
import ModelStripeCheckout from './models/stripe_checkout.model.js';
import debug from 'debug';
const log = debug('app:sql');

// Global Variables
let db = null;
let sequelize = null;
// you can also use "log" function variable or "console.log"
// Using false here because seeing the SQL statements can get noisy
const logger = false;
const models = {};

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
	} else if (config.SQL_URI !== 'GCP') {
		// Normal SQL_URI
		log('[SQL] USING GIVEN ENV VAR SQL_URI');
		return new Sequelize(config.SQL_URI, sql);
	} else {
		// Google Cloud Specific
		//
		// We don't need this module when using the current method
		// But it's here for your awareness if you want to switch to it
		// import { Connector } from '@google-cloud/cloud-sql-connector';
		//
		// NOTE: Ensure your SQL instance has a "Public IP"
		// Seems like a bad idea but that's what GCP recommends
		// Later on, we'll have an alternative way to connect via VPN to VPC
		// https://cloud.google.com/sql/docs/postgres/connect-run
		// https://www.youtube.com/watch?v=cBrn5IM4mA8

		// Adapt to Google Cloud
		// https://cloud.google.com/sql/docs/postgres/connect-overview
		log('[SQL] USING GCP CLOUD SQL');
		if (config.SQL_DATABASE && config.SQL_DATABASE !== '') {
			sql.host = '/cloudsql/' + config.SQL_CONNNAME;
			sql.dialectOptions = {
				socketPath: '/cloudsql/' + config.SQL_CONNNAME,
			};
			sql.database = config.SQL_DATABASE;
			// Disable TLS/SSL because we are using sockets
			sql.ssl = false;
			//sql.dialectOptions.ssl.require = false;
		}
		if (config.SQL_USERNAME && config.SQL_USERNAME !== '') {
			sql.username = config.SQL_USERNAME;
		}
		if (config.SQL_PASSWORD && config.SQL_PASSWORD !== '') {
			sql.password = config.SQL_PASSWORD;
		}
		sql.dialect = 'postgres';
		sql.port = 5432;
		return new Sequelize(sql);
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

	// Initialize Models
	models.request_log = ModelRequestLog(sequelize, models);
	models.csp_report = ModelCSPReport(sequelize, models);
	models.account = ModelAccount(sequelize, models);
	models.user = ModelUser(sequelize, models);
	models.join_account_user = ModelJoinAccountUser(sequelize, models);
	models.session = ModelSession(sequelize, models);
	models.task = ModelTask(sequelize, models);
	models.analytics_session = ModelAnalyticsSession(sequelize, models);
	models.analytics_event = ModelAnalyticsEvent(sequelize, models);
	models.stripe_checkout = ModelStripeCheckout(sequelize, models);

	// Glue the models together with associations
	// Required to do the 2-way data binding

	// Accounts <=> Users
	models.account.belongsToMany(models.user, {
		through: models.join_account_user,
		foreignKey: 'account_id',
	});
	models.user.belongsToMany(models.account, {
		through: models.join_account_user,
		foreignKey: 'user_id',
	});

	// User => Sessions
	models.user.hasMany(models.session, { foreignKey: 'user_id' });
	models.session.belongsTo(models.user, { foreignKey: 'user_id' });

	// User => Tasks
	models.user.hasMany(models.task, { foreignKey: 'user_id' });
	models.task.belongsTo(models.user, { foreignKey: 'user_id' });

	// Connect to Database
	db = await connect(sequelize);

	// Using Migrations is recommended... but this option is available
	// WARNING: Use at your own peril
	//await sequelize.sync();
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
	// Including underscored private resources
	// But try to use "models" in most circumstances
	_sequelize: sequelize,
	_db: db,
	models: models,
};
