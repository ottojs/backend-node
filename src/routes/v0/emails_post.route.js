// Modules
import { z } from 'zod';
import config from '../../lib/config.js';
import email from '../../emails/index.js';

const req_body_schema = z.object({
	// Required
	to_address: z.string().trim().toLowerCase().email(),
	to_name: z.string().trim().toLowerCase().min(1).max(60),
	code: z.enum([config.REGISTER_CODE]),
});

async function r_v0_emails_post(req, res, next) {
	// Check body
	const check = req_body_schema.safeParse(req.body);
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Send Email
	email.send('basic', {
		to_address: req.body.to_address,
		to_name: req.body.to_name,
	});

	// Response
	res.status(201);
	res.json({
		status: 'ok',
		data: {},
	});
	return next();
}

export default r_v0_emails_post;
