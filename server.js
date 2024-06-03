// Modules
import app from './src/index.js';

// HTTP Server
app.listen(8080, '127.0.0.1', function () {
	console.log(`[HTTP:SERVER] OK - Listening on 8080`);
});
