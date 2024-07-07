// Modules
import sql from '../../sql/index.js';

async function r_v0_analytics_sessions_post(req, res, next) {
	// New Session
	const result = await sql.models.analytics_session.create({
		ip_address: req.appdata.ip,
	});

	// Response
	res.status(201);
	res.json({
		status: 'ok',
		data: {
			session: result.json(),
		},
	});
	return next();
}

export default r_v0_analytics_sessions_post;
