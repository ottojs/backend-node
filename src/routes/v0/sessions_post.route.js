// Modules
import argon2 from 'argon2';
import sql from '../../sql/index.js';
import config from '../../lib/config.js';
import cookie from '../../lib/cookie.js';

async function r_v0_sessions_post(req, res, next) {
	const check = sql.models.session.schema(req.body);

	// Fail if Invalid
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Look Up User
	const found_user = await sql.models.user.findOne({
		where: {
			username: check.data.username,
		},
	});

	if (found_user === null) {
		// Spin wheels if User not found
		// We do this regardless if user exists
		// for security against timing attacks
		await argon2.hash(check.data.password);
		return next(new Error('forbidden'));
	}

	// Password Matched?
	const password_matched = await argon2.verify(
		found_user.password,
		check.data.password
	);
	if (password_matched !== true) {
		return next(new Error('forbidden'));
	}

	// Create Session
	const created_session = await sql.models.session.create({
		user_id: found_user.id,
	});

	// Set Cookie
	res.cookie(
		config.COOKIE_NAME_SESSION,
		created_session.uuid,
		cookie.settings(8) // 8 Hours
	);

	// Response
	res.status(201);
	res.json({
		status: 'created',
		data: {
			session: created_session.json(),
			user: found_user.json(),
		},
	});
	return next();
}

export default r_v0_sessions_post;
