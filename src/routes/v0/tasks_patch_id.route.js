// Modules
import _ from 'lodash';
import v from 'validator';
import sql from '../../sql/index.js';

async function r_v0_tasks_patch(req, res, next) {
	if (!req.params.uuid || v.isUUID(req.params.uuid) === false) {
		return next(new Error('bad_request'));
	}
	const found_task = await sql.models.task.findOne({
		where: {
			user_id: req.user.id,
			uuid: req.params.uuid,
		},
	});
	if (found_task === null) {
		return next(new Error('not_found'));
	}

	// Check Body
	const check = sql.models.task.schema(req.body);
	// Fail if Invalid
	if (check.success === false) {
		return next(new Error('bad_request'));
	}
	// Update
	_.merge(found_task, check.data);
	found_task.save();

	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			task: found_task.json(),
		},
	});
	return next();
}

export default r_v0_tasks_patch;
