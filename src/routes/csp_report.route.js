// Modules
import sql from '../sql/index.js';

function r_csp_report(req, res, next) {
	// Save to Database
	sql.models.csp_report.create({
		ip: req.ip,
		headers_raw: JSON.stringify(req.headers),
		body_raw: JSON.stringify(req.body),
	});

	// Response
	// same-origin, same-site, cross-origin
	res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
	res.status(201);
	res.json({
		status: 'created',
	});
	// TODO: We may not want to call next() and end things here
	return next();
}

export default r_csp_report;

// We serialize the raw headers and body for later analysis
// If you're curious about the information in the CSP report:
//
// Example Report Body (Chrome)
// {
//   'csp-report': {
//     'document-uri': 'http://localhost:3111/',
//     referrer: 'http://localhost:3111/',
//     'violated-directive': 'script-src-elem',
//     'effective-directive': 'script-src-elem',
//     'original-policy': "default-src 'none';script-src 'self';style-src 'none';img-src 'self';connect-src 'self' http://localhost:8080;font-src 'none';object-src 'none';media-src 'none';frame-src 'none';report-uri http://localhost:8080/csp-report;form-action 'self';frame-ancestors 'none';base-uri 'self';manifest-src 'self';script-src-attr 'none';upgrade-insecure-requests",
//     disposition: 'enforce',
//     'blocked-uri': 'inline',
//     'line-number': 4,
//     'source-file': 'http://localhost:3111/',
//     'status-code': 200,
//     'script-sample': ''
//   }
// }
//
// Chrome Only (maybe)
// 'script-sample': ''
//
// Firefox Only (maybe)
// 'column-number': 1024,
