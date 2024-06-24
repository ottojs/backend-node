function r_health(req, res) {
	res.status(200);
	res.json({ status: 'ok' });
	// Do not call next, it will clutter logs
}

export default r_health;
