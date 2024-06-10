function r_v0_accounts_get(req, res, next) {
	let returnable = [];
	if (req.user.ModelAccounts && req.user.ModelAccounts.length > 0) {
		returnable = req.user.ModelAccounts.map((a) => a.json());
	}
	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			accounts: returnable,
		},
	});
	return next();
}

export default r_v0_accounts_get;
