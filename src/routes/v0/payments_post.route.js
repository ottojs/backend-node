// Modules
import { z } from 'zod';
import Stripe from 'stripe';
import config from '../../lib/config.js';
import sql from '../../sql/index.js';

// Initialize Stripe
let stripe = false;
if (config.STRIPE_SECRET_KEY !== 'disabled') {
	stripe = new Stripe(config.STRIPE_SECRET_KEY, {
		apiVersion: config.STRIPE_API_VERSION,
	});
}

const req_body_schema = z.object({
	// Required
	session_id: z.string().trim().toLowerCase().uuid(),
	type: z.enum(['one-time', 'subscription']),
	path_success: z.string().trim().toLowerCase().min(1).max(50),
	path_cancel: z.string().trim().toLowerCase().min(1).max(50),
	// Optional
	email: z.string().trim().email().optional(),
});

// https://docs.stripe.com/checkout/quickstart
// https://docs.stripe.com/api/checkout/sessions/create
async function r_v0_payments_post(req, res, next) {
	// Check body
	const check = req_body_schema.safeParse(req.body);
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Calculate Mode and Price
	let price_code;
	let payment_mode;
	if (
		stripe &&
		req.body.type === 'one-time' &&
		config.STRIPE_ONETIME_PRICE_ID !== 'disabled'
	) {
		payment_mode = 'payment';
		price_code = config.STRIPE_ONETIME_PRICE_ID;
	} else if (
		stripe &&
		req.body.type === 'subscription' &&
		config.STRIPE_SUBSCRIPTION_PRICE_ID !== 'disabled'
	) {
		payment_mode = 'subscription';
		price_code = config.STRIPE_SUBSCRIPTION_PRICE_ID;
	} else {
		return next(new Error('not_implemented'));
	}

	// Tell Stripe the details...
	const checkout_session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: price_code,
				quantity: 1,
			},
		],
		// payment: one-time
		// setup: save payment details for later
		// subscription: fixed-price recurring payments
		mode: payment_mode,
		success_url: config.APP_URI + req.body.path_success,
		cancel_url: config.APP_URI + req.body.path_cancel,
		automatic_tax: { enabled: true },
		// Set this if you want to pre-fill customer email
		customer_email: req.body.email ? req.body.email : undefined,
	});

	// Save Checkout Session ID
	await sql.models.stripe_checkout.create({
		analytics_session_id: req.body.session_id,
		checkout_session_id: checkout_session.id,
		ip_address: req.appdata.ip,
	});

	// Save as Event
	await sql.models.analytics_event.create({
		session_id: req.body.session_id,
		name: 'checkout_redirect',
		ip_address: req.appdata.ip,
		data: {
			checkout_id: checkout_session.id,
		},
	});

	// Response
	res.status(201);
	res.json({
		status: 'ok',
		data: {
			url: checkout_session.url,
		},
	});
	return next();
}

export default r_v0_payments_post;
