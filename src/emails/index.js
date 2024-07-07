// Modules
import url from 'node:url';
import path from 'node:path';
import _ from 'lodash';
import Email from 'email-templates';
import previewEmail from 'preview-email';
import config from '../lib/config.js';
import debug from 'debug';
const log = debug('app:email');
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const email = new Email({
	// message: {
	// 	from: 'App Alerts <alerts@mail.example.com>',
	// },
	// transport: {
	// 	jsonTransport: true,
	// },
	views: {
		options: {
			extension: 'ejs',
		},
	},
	htmlToText: false,
	preview: {
		open: {
			//app: 'put-browser-name-here-to-force',
			wait: false,
		},
	},
});

// https://github.com/leemunroe/responsive-html-email-template
async function generate(template, vars) {
	// Calculate "to" with name if available
	let to = vars.to_address;
	if (vars.to_name) {
		to = `${vars.to_name} <${vars.to_address}>`;
	}

	// Generate
	const resources = {
		webResources: {
			relativeTo: path.join(__dirname, 'templates', template),
		},
	};
	const subject = await email.render(
		{
			path: path.join(__dirname, 'templates', template, 'subject'),
			juiceResources: resources,
		},
		vars
	);
	const text = await email.render(
		{
			path: path.join(__dirname, 'templates', template, 'text'),
			juiceResources: resources,
		},
		vars
	);
	const html = await email.render(
		{
			path: path.join(__dirname, 'templates', template, 'html'),
			juiceResources: resources,
		},
		vars
	);

	return {
		to,
		subject,
		text,
		html,
	};
}

async function send(template_name, template_data) {
	const provider = config.EMAIL_PROVIDER;
	const message = await generate(
		template_name,
		_.defaults(template_data, {
			provider,
		})
	);
	let result = {
		id: 'preview-' + Date.now(),
	};
	previewEmail(message);
	log(`EMAIL SENT: ${provider} ${result.id}`);
}

export default {
	send,
};
