// Modules
import sql from '../sql/index.js';
import debug from 'debug';
const log = debug('app:mw:load_user');

async function mw_load_user(req, res, next) {
	req.user = null;
	if (req.session && req.session.user_id !== undefined) {
		req.user = await sql.models.user.findOne({
			where: {
				id: req.session.user_id,
			},
			include: [
				{
					model: sql.models.account,
				},
			],
		});
		// TODO: Improve Handling and Alerting
		if (req.user) {
			//if (req.user.ModelAccounts) {
			for (const acc of req.user.ModelAccounts) {
				//if (acc.ModelJoinAccountUser) {
				acc.roles = acc.ModelJoinAccountUser.roles.split(',');
			}
			log('[MW:USER:LOAD]', req.user.id);
			//log(req.user.ModelAccounts[0].name, req.user.ModelAccounts[0].roles);
		} else {
			log('[MW:USER:LOAD] NO USER');
			// TODO: Log out session and report
		}
	} else {
		log('[MW:USER:LOAD] NO SESSION');
	}
	return next();
}

export default mw_load_user;
