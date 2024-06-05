// Modules
import sql from '../sql/index.js';
import debug from 'debug';
const log = debug('app:mw:request_end');

function mw_request_end(req, res, next) {
	req.appdata.time_end = Date.now();
	req.appdata.time_total = req.appdata.time_end - req.appdata.time_start;
	req.appdata.time_total_routes =
		req.appdata.time_end - req.appdata.time_routes;
	log(
		'LOG REQUEST SUCCESSFUL',
		req.appdata.time_total,
		'ms',
		req.appdata.time_total_routes
	);

	// Fire and Forget SQL Query - No Waiting
	sql.models.request_log.create({
		uuid: req.appdata.uuid,
		method: req.appdata.method,
		path: req.appdata.path,
		status: res.statusCode,
		time_total: req.appdata.time_total,
		time_routes: req.appdata.time_total_routes,
		// ===== IP GEO =====
		ip: req.appdata.ip,
		// Requires Processing Later with GeoLite2
		// ip_geo_raw: JSON.stringify(req.appdata.ip_geo),
		// ip_geo_country: req.appdata.ip_geo.country,
		// ip_geo_region: req.appdata.ip_geo.region,
		// ip_geo_city: req.appdata.ip_geo.city,
		// ip_geo_eu: req.appdata.ip_geo.eu,
		// ===== Browser / User-Agent =====
		browser_name: req.appdata.ua.browser_name,
		browser_version: req.appdata.ua.browser_version,
		device_name: req.appdata.ua.device_name,
		os_name: req.appdata.ua.os_name,
		os_version: req.appdata.ua.os_version,
		cpu_arch: req.appdata.ua.cpu_arch,
		// ===== Referrer =====
		referrer_raw: req.appdata.referrer.raw,
		referrer_domain: req.appdata.referrer.domain,
		referrer_source: req.appdata.referrer.source,
		// ===== UTM / Urchin Tracking Module =====
		utm_source: req.appdata.utm.source,
		utm_medium: req.appdata.utm.medium,
		utm_campaign: req.appdata.utm.campaign,
		utm_term: req.appdata.utm.term,
		utm_content: req.appdata.utm.content,
		// ===== Processed Flag =====
		processed: false,
	});

	return next();
}

export default mw_request_end;
