function r_v0_sessions_get(req, res, next) {
	let accounts_returnable = [];
	if (req.user.ModelAccounts && req.user.ModelAccounts.length > 0) {
		accounts_returnable = req.user.ModelAccounts.map((a) => a.json());
	}
	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			session: req.session.json(),
			user: req.user.json(),
			accounts: accounts_returnable,
		},
	});
	return next();
}

export default r_v0_sessions_get;
