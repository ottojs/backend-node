
async function r_v0_example_table_get(req, res, next) {
	let returnable = [
		{
			id: 1,
			name: 'Alice',
			email: 'alice@example.com',
		},
		{
			id: 2,
			name: 'Bob',
			email: 'bob@example.com',
		},
		{
			id: 3,
			name: 'Chris',
			email: 'chris@example.com',
		},
		{
			id: 4,
			name: 'Dakota',
			email: 'dakota@example.com',
		},
		{
			id: 5,
			name: 'Eleanor',
			email: 'eleanor@example.com',
		},
	];
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

export default r_v0_example_table_get;
