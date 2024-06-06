// Modules
import config from '../../lib/config.js';
import sql from '../../sql/index.js';
import argon2 from 'argon2';

async function r_v0_users_post(req, res, next) {
	const check = sql.models.user.schema(req.body);

	// Fail if Invalid
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Check Code
	if (req.body.code !== config.REGISTER_CODE) {
		return next(new Error('forbidden'));
	}

	// Hash Password In-Place
	// We do this regardless if user exists
	// for security against timing attacks
	check.data.password = await argon2.hash(check.data.password);

	// Load User
	const found_user = await sql.models.user.findOne({
		where: {
			username: check.data.username,
		},
	});

	// Create User if not found
	if (found_user === null) {
		const t = await sql._sequelize.transaction();
		try {
			const created_account = await sql.models.account.create(
				{
					name: `${check.data.username}'s Account`,
				},
				{ transaction: t }
			);
			const created_user = await sql.models.user.create(
				{
					username: check.data.username,
					password: check.data.password,
				},
				{
					transaction: t,
				}
			);
			await created_account.addModelUser(created_user, {
				transaction: t,
				through: { roles: 'owner' },
			});
			await t.commit();
		} catch (error) {
			// If the execution reaches this line, an error was thrown.
			// We rollback the transaction
			console.log(error);
			await t.rollback();
		}
	}

	// TODO: Here is a good place to email with activation link or a
	// notification that someone is attempting to create an account

	// We respond the same with 201 even if there is an existing account
	// This prevents being able to know if a user is using the service
	res.status(201);
	res.json({
		status: 'created',
		data: {
			message: 'ok',
		},
	});
	return next();
}

export default r_v0_users_post;
