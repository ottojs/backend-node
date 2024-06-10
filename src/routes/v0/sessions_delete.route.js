// Modules
import config from '../../lib/config.js';

async function r_v0_sessions_delete(req, res, next) {
	if (req.params.uuid !== 'me') {
		return next(new Error('forbidden'));
	}

	// Mark deleted_reason as manually logged out
	req.session.deleted_reason = 'manual';
	await req.session.save();
	// Delete Session
	await req.session.destroy();

	// Remove Cookie
	res.clearCookie(config.COOKIE_NAME_SESSION);

	// TODO: json() return deleted_at and deleted_reason
	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			session: req.session.json(),
		},
	});
	return next();
}

export default r_v0_sessions_delete;
