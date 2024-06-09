// Modules
import sql from '../../sql/index.js';
import random_hex from '../../lib/random_hex.js';

async function r_v0_users_patch(req, res, next) {
	if (req.params.uuid !== 'me') {
		return next(new Error('forbidden'));
	}
	// Check Params
	const check = sql.models.user.schema_update(req.body);
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Update and Save
	req.user.name_first = check.data.name_first;
	req.user.name_last = check.data.name_last;
	req.user.picture = check.data.picture;
	if (req.body.color === 'new') {
		req.user.color = random_hex();
	}
	await req.user.save();

	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			user: req.user.json(),
		},
	});
	return next();
}

export default r_v0_users_patch;
