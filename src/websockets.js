import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import cookie from 'cookie';
import cookie_parser from 'cookie-parser';
import config from './lib/config.js';
import debug from 'debug';
const log = debug('app:ws');

let wss;

export function ws_init(server) {
	// Attach to HTTP Server
	wss = new WebSocketServer({
		path: '/ws',
		server: server,
		// noServer: true,
	});

	// Custom WebSocket upgrade handler
	// This must be used with "noServer" option above
	// Using "server" option will cause a double-handling error
	// If you do not want to use a custom handler, you can use "server" above
	//
	// server.on('upgrade', ws_custom_upgrade_handler);

	// Handle Connections
	wss.on('connection', (ws, req) => {
		ws.id = uuidv4();
		log('CONNECTED:', ws.id);
		if (req.headers && req.headers.cookie) {
			const cookies = cookie.parse(req.headers.cookie);
			const sid = cookie_parser.signedCookie(
				cookies[config.COOKIE_NAME_SESSION],
				config.COOKIE_SECRET
			);
			ws.session = { id: sid };
			//log('COOKIES', cookies.sid, sid);
			log('SESSION:', ws.session);
			// TODO: Terminate if invalid session
			// ws.terminate();
		} else {
			log('SESSION: NONE');
		}

		ws.on('close', () => {
			log('DISCONNECTED:', ws.id);
		});
		ws.on('pong', () => {
			log('PONG', ws.id);
		});
		ws.on('message', (message) => {
			log('RECEIVED:', message, ws.id);
		});

		// Send Welcome
		ws.send(
			JSON.stringify({
				id: Date.now(),
				name: 'Connected! Welcome',
			})
		);
	});
}

// Custom upgrade handler
export function ws_custom_upgrade_handler(req, socket, head) {
	// req.headers.cookie
	if (req.headers['upgrade'] !== 'websocket') {
		return socket.destroy();
	}
	wss.handleUpgrade(req, socket, head, (ws) => {
		wss.emit('connection', ws, req);
	});
}

// Broadcast to all connections
export function ws_broadcast(type, data) {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			if (type === 'ping') {
				client.ping();
			} else {
				client.send(JSON.stringify(data));
			}
		}
	});
}

// Ping every 30 seconds
setInterval(() => {
	log('PING');
	ws_broadcast('ping');
}, 30 * 1000);

// Message every 10 seconds
setInterval(() => {
	ws_broadcast('msg', {
		id: Date.now(),
		name: 'User',
	});
}, 10 * 1000);

export default ws_init;
