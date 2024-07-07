// Modules
import { z } from 'zod';
import sql from '../../sql/index.js';

const req_body_schema = z.object({
	// Required
	session_id: z.string().trim().toLowerCase().uuid(),
	name: z.string().trim().toLowerCase().min(1).max(100),
	data: z.object({}),
});

async function r_v0_analytics_events_post(req, res, next) {
	// Check body
	const check = req_body_schema.safeParse(req.body);
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Check for Session
	const existing_session = await sql.models.analytics_session.findOne({
		where: {
			uuid: req.body.session_id,
		},
	});
	if (existing_session === null) {
		return next(new Error('bad_request'));
	}

	// Save Event
	const result = await sql.models.analytics_event.create({
		session_id: req.body.session_id,
		name: req.body.name,
		ip_address: req.appdata.ip,
		data: JSON.stringify(req.body.data),
	});

	// Response
	res.status(201);
	res.json({
		status: 'ok',
		data: {
			session: existing_session.json(),
			event: result.json(),
		},
	});
	return next();
}

export default r_v0_analytics_events_post;
