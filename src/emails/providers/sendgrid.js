// Modules
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
import config from '../../lib/config.js';

// Initialize
if (config.EMAIL_SENDGRID_API_KEY !== 'disabled') {
	sgMail.setApiKey(config.EMAIL_SENDGRID_API_KEY);
}

// Send
// https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
export async function send(message) {
	if (config.sendgrid === 'disabled') {
		console.warn(
			'WARN:EMAIL:SENDGRID You attempted to send an email with SendGrid but it is not properly configured.'
		);
		return;
	}
	message.from = {
		email: config.sendgrid.from_email,
		name: config.sendgrid.from_name,
	};
	const response = await sgMail.send(message);
	return response;
}

// Response is:
// [
//   Response {
//     statusCode: 202,
//     body: '',
//     headers: Object [AxiosHeaders] {
//       server: 'nginx',
//       date: 'Day, 01 Jan 2024 00:00:00 GMT',
//       'content-length': '0',
//       connection: 'keep-alive',
//       'x-message-id': 'SOMEIDHERE',
//       'access-control-allow-origin': 'https://sendgrid.api-docs.io',
//       'access-control-allow-methods': 'POST',
//       'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//       'access-control-max-age': '600',
//       'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html',
//       'strict-transport-security': 'max-age=600; includeSubDomains'
//     }
//   },
//   ''
// ]

export default {
	send,
};
