function r_health(req, res, next) {
	res.status(200);
	res.json({ status: 'ok' });
	return next();
}

export default r_health;
