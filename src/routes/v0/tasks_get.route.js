// Modules
import sql from '../../sql/index.js';

async function r_v0_tasks_get(req, res, next) {
	const tasks_query = await sql.models.task.findAll({
		where: {
			user_id: req.user.id,
		},
		order: [['order', 'ASC']],
		limit: 25,
	});
	const returnable = tasks_query.map((t) => t.json());
	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			tasks: returnable,
		},
	});
	return next();
}

export default r_v0_tasks_get;
