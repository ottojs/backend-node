// Modules
import config from './src/lib/config.js';
import app from './src/index.js';

// NOTE: This file is kept simple intentionally
//       Please don't add anything here unless
//       it directly relates to the HTTP server

// HTTP Server
app.listen(config.PORT, config.LISTEN, function () {
	console.log(
		`[HTTP:SERVER] OK - Listening on ${config.LISTEN}:${config.PORT}`
	);
});

// Handle exceptions and shutdown
process
	.on('unhandledRejection', (reason, p) => {
		console.error(reason, 'Unhandled Rejection at Promise', p);
		process.exit(1);
	})
	.on('uncaughtException', (err) => {
		console.error(err, 'Uncaught Exception thrown');
		process.exit(1);
	});
