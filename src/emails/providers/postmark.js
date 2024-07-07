// Modules
import postmark from 'postmark';
import config from '../../lib/config.js';

// Initialize
let client = {
	sendEmail: async function () {
		console.warn(
			'WARN:EMAIL:POSTMARK You attempted to send an email with Postmark but it is not properly configured.'
		);
		return { MessageID: 'not-set-up' };
	},
};
if (config.EMAIL_POSTMARK_API_KEY !== 'disabled') {
	client = new postmark.ServerClient(config.EMAIL_POSTMARK_API_KEY);
}

// Send
export async function send(message) {
	// Alternative OOP version if you want it
	// const message = new postmark.Models.Message('from@example.com', 'Test subject', 'Html body', 'Text body', 'to@example.com');
	const response = await client.sendEmail({
		From: `${config.postmark.from_name} <${config.postmark.from_email}>`,
		// 'test@blackhole.postmarkapp.com'
		To: message.to,
		Subject: message.subject,
		HtmlBody: message.html,
		TextBody: message.text,
		MessageStream: config.postmark.stream,
	});
	return response;
}

// {
//   To: 'Some User <user@example.com>',
//   SubmittedAt: '2024-07-01T00:00:00.9999991Z',
//   MessageID: 'UUIDHERE',
//   ErrorCode: 0,
//   Message: 'OK'
// }

export default {
	send,
};
