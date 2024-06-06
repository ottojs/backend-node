// Modules
import argon2 from 'argon2';
import sql from '../../src/sql/index.js';

async function reset() {
	const models = ['account', 'user', 'join_account_user', 'session'];
	await Promise.all(
		models.map(async function (key) {
			await sql.models[key].destroy({
				where: {},
				force: true,
				truncate: true,
				restartIdentity: true,
			});
			await sql._sequelize.query(
				`DELETE FROM sqlite_sequence WHERE name = '${sql.models[key].tableName}'`
			);
		})
	);
}

async function seed_users() {
	// Accounts
	await sql.models.account.create({
		name: 'Admin Account',
	});
	await sql.models.account.create({
		name: 'User Account',
	});
	// Users
	const password_hash = await argon2.hash('admin');
	await sql.models.user.create({
		username: 'admin@example.com',
		password: password_hash,
		name_first: 'Admin',
		name_last: 'User',
	});
	await sql.models.user.create({
		username: 'user@example.com',
		password: password_hash,
		name_first: 'Basic',
		name_last: 'User',
	});
	await sql.models.user.create({
		username: 'inactive@example.com',
		password: password_hash,
		name_first: 'Inactive',
		name_last: 'User',
	});
	// Join
	await sql.models.join_account_user.create({
		account_id: 1,
		user_id: 1,
		roles: 'admin',
	});
	await sql.models.join_account_user.create({
		account_id: 2,
		user_id: 2,
		roles: 'user',
	});
}

export default {
	reset: reset,
	users: seed_users,
};
