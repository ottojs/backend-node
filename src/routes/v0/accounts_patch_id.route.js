// Modules
import v from 'validator';
import sql from '../../../src/sql/index.js';

async function r_v0_accounts_patch_id(req, res, next) {
	if (v.isUUID(req.params.uuid) === false) {
		return next(new Error('bad_request'));
	}
	// TODO: Only supports 1 Account at this time
	let account_result;
	if (req.user.ModelAccounts && req.user.ModelAccounts.length > 0) {
		account_result = req.user.ModelAccounts[0];
	} else {
		return next(new Error('bad_request'));
	}
	if (account_result.uuid !== req.params.uuid) {
		return next(new Error('forbidden'));
	}
	// Only Account Owner can update the Account
	if (account_result.ModelJoinAccountUser.roles !== 'owner') {
		return next(new Error('forbidden'));
	}

	// Check Body
	const check = sql.models.account.schema(req.body);
	// Fail if Invalid
	if (check.success === false) {
		return next(new Error('bad_request'));
	}
	// Update
	account_result.name = check.data.name;
	await account_result.save();

	// Response
	res.status(200);
	res.json({
		status: 'ok',
		data: {
			account: account_result.json(),
		},
	});
	return next();
}

export default r_v0_accounts_patch_id;
