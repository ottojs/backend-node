function r_root(req, res, next) {
	res.status(200);
	res.json({ status: 'ok' });
	return next();
}

export default r_root;
