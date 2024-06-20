// Modules
import sql from '../../sql/index.js';

async function r_v0_tasks_post(req, res, next) {
	const check = sql.models.task.schema(req.body);

	// Fail if Invalid
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Create
	const created_task = await sql.models.task.create({
		user_id: req.user.id,
		title: check.data.title,
		description: check.data.description,
	});

	// Response
	res.status(201);
	res.json({
		status: 'created',
		data: {
			task: created_task.json(),
		},
	});
	return next();
}

export default r_v0_tasks_post;
