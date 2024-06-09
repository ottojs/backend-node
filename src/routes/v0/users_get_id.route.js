// Modules
import v from 'validator';
import sql from '../../sql/index.js';

async function r_v0_users_get_id(req, res, next) {
	if (!req.params.uuid) {
		return next(new Error('bad_request'));
	}
	let user_result;
	if (req.params.uuid === 'me') {
		user_result = req.user;
	} else if (v.isUUID(req.params.uuid) === true) {
		// Load User
		user_result = await sql.models.user.findOne({
			where: {
				uuid: req.params.uuid,
			},
		});
		if (user_result === null) {
			return next(new Error('not_found'));
		}
	} else {
		return next(new Error('bad_request'));
	}

	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			user: user_result.json(),
		},
	});
	return next();
}

export default r_v0_users_get_id;
