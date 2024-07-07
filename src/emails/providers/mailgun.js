// Modules
import formdata from 'form-data';
import Mailgun from 'mailgun.js';
import config from '../../lib/config.js';

// Initialize
let mg = {
	messages: {
		create: async function () {
			console.warn(
				'WARN:EMAIL:MAILGUN You attempted to send an email with Mailgun but it is not properly configured.'
			);
			return { id: 'not-set-up' };
		},
	},
};
if (config.EMAIL_MAILGUN_API_KEY !== 'disabled') {
	const mailgun = new Mailgun(formdata);
	mg = mailgun.client({
		username: 'api',
		key: config.EMAIL_MAILGUN_API_KEY,
		url: config.mailgun.api_endpoint,
	});
}

// Send
export async function send(message) {
	message.from = `${config.mailgun.from_name} <${config.mailgun.from_email}>`;
	message['h:Reply-To'] = config.mailgun.reply_to;
	const response = await mg.messages.create(config.mailgun.domain, message);
	return response;
}

// {
//   status: 200,
//   id: '<RANDOM@mailgun.example.com>',
//   message: 'Queued. Thank you.'
// }

export default {
	send,
};
