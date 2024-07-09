// Modules
import _ from 'lodash';
import { z } from 'zod';
import sql from '../../sql/index.js';

const req_param_uuid = z.string().trim().toLowerCase().uuid();
const req_body_schema = z.object({
	// Required
	data: z.object({
		email: z.string().trim().toLowerCase().email().optional(),
	}),
});

async function r_v0_analytics_sessions_patch_id(req, res, next) {
	// Check params
	const checkparams = req_param_uuid.safeParse(req.params.uuid);
	if (checkparams.success === false) {
		return next(new Error('bad_request'));
	}
	// Check body
	const check = req_body_schema.safeParse(req.body);
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Check for Session
	const existing_session = await sql.models.analytics_session.findOne({
		where: {
			uuid: req.params.uuid,
		},
	});
	if (existing_session === null) {
		return next(new Error('bad_request'));
	}

	// Update Session
	existing_session.data = JSON.stringify(
		_.defaults(req.body.data, JSON.parse(existing_session.data))
	);
	const updated_session = await existing_session.save();

	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			session: updated_session.json(),
		},
	});
	return next();
}

export default r_v0_analytics_sessions_patch_id;
