// Modules
import v from 'validator';
import sql from '../../sql/index.js';

async function r_v0_tasks_delete(req, res, next) {
	if (!req.params.uuid || v.isUUID(req.params.uuid) === false) {
		return next(new Error('bad_request'));
	}
	const found_task = await sql.models.task.findOne({
		where: {
			uuid: req.params.uuid,
			user_id: req.user.id,
		},
	});
	if (found_task === null) {
		return next(new Error('not_found'));
	}
	// Delete
	found_task.destroy();

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

export default r_v0_tasks_delete;
