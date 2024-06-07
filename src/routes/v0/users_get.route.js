// Modules
import sql from '../../sql/index.js';

async function r_v0_users_get(req, res, next) {
	// Query Users
	const users_query = await sql.models.user.findAll({
		order: [['id', 'ASC']],
		limit: 10,
	});
	const returnable = users_query.map((u) => u.json());

	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			users: returnable,
		},
	});
	return next();
}

export default r_v0_users_get;
