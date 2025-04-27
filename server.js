// Modules
import http from 'http';
import config from './src/lib/config.js';
import app from './src/index.js';
import websockets from './src/websockets.js';

// NOTE: This file is kept simple intentionally
//       Please don't add anything here unless
//       it directly relates to the HTTP server

// Start HTTP Server
// app.listen is a shortcut for creating an HTTP Server, but
// we use http.createServer() instead to add a websockets listener
//
// app.listen(config.PORT, config.LISTEN, function () {});
const server = http.createServer(app);
websockets(server);
server.listen(config.PORT, config.LISTEN, (err) => {
	if (err) {
		throw err;
	}
	console.log(
		`[HTTP:SERVER] OK - Listening on ${config.LISTEN}:${config.PORT}`
	);
});

// Handle exceptions and exit
process
	.on('unhandledRejection', (reason, p) => {
		console.error(reason, 'Unhandled Rejection at Promise', p);
		process.exit(1);
	})
	.on('uncaughtException', (err) => {
		console.error(err, 'Uncaught Exception thrown');
		process.exit(1);
	});
