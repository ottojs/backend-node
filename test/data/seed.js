// Modules
import request from 'supertest';
import argon2 from 'argon2';
import sql from '../../src/sql/index.js';
import app from '../../src/index.js';

async function reset() {
	const models = [
		'account',
		'csp_report',
		'join_account_user',
		'request_log',
		'session',
		'task',
		'user',
	];
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

async function users() {
	// Accounts
	await sql.models.account.create({
		name: 'Admin Account',
	});
	await sql.models.account.create({
		name: 'User Account',
	});
	// Users
	const password_hash = await argon2.hash('testingpass');
	await sql.models.user.create({
		username: 'admin@example.com',
		password: password_hash,
		name_first: 'Admin',
		name_last: 'User',
	});
	await sql.models.user.create({
		username: 'owner@example.com',
		password: password_hash,
		name_first: 'Owner',
		name_last: 'User',
	});
	await sql.models.user.create({
		username: 'normal@example.com',
		password: password_hash,
		name_first: 'Normal',
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
		roles: 'owner',
	});
	await sql.models.join_account_user.create({
		account_id: 2,
		user_id: 3,
		roles: 'member',
	});

	// We return this for ease of accessing UUIDs, etc
	const users = await sql.models.user.findAll({
		include: [
			{
				model: sql.models.account,
			},
		],
		order: [['id', 'ASC']],
	});
	return users;
}

// Unfortunately, we need to go through the HTTP app for now
// because our cookies are signed. There is likely a way to sign
// values with the cookie secret but for now we'll do it this way
// TODO: Sign cookie data so we can work directly with database
async function login(email) {
	const res = await request(app)
		.post('/v0/sessions')
		.set('Accept', 'application/json')
		.set('Content-Type', 'application/json')
		.send({
			username: email,
			password: 'testingpass',
		});
	// Use with: request.set('Cookie', cookies)
	return res.headers['set-cookie'];
}

async function tasks() {
	// Admin
	await sql.models.task.create({
		user_id: 1,
		title: 'Admin Title 1',
		description: 'Admin Description 1',
		order: 1,
		completed: false,
	});
	await sql.models.task.create({
		user_id: 1,
		title: 'Admin Title 2',
		description: 'Admin Description 2',
		order: 2,
		completed: true,
	});
	// Owner
	await sql.models.task.create({
		user_id: 2,
		title: 'Owner Title 1',
		description: 'Owner Description 1',
		order: 1,
		completed: false,
	});

	// We return this for ease of accessing UUIDs, etc
	const tasks = await sql.models.task.findAll({
		order: [['id', 'ASC']],
	});
	return tasks;
}

export default {
	sql,
	reset,
	users,
	login,
	tasks,
};
