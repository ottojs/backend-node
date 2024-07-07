// Modules
import _ from 'lodash';
import Stripe from 'stripe';
import config from '../../lib/config.js';

// Initialize Stripe
let stripe = false;
if (config.STRIPE_SECRET_KEY !== 'disabled') {
	stripe = new Stripe(config.STRIPE_SECRET_KEY, {
		apiVersion: config.STRIPE_API_VERSION,
	});
}

// https://docs.stripe.com/checkout/quickstart
// https://docs.stripe.com/api/checkout/sessions/create
async function r_v0_payments_post(req, res, next) {
	if (!req.body || !req.body.type || !_.isString(req.body.path_success)) {
		return next(new Error('bad_request'));
	}
	if (req.body.type !== 'one-time' && req.body.type !== 'subscription') {
		return next(new Error('bad_request'));
	}
	if (
		!req.body ||
		!req.body.path_success ||
		!_.isString(req.body.path_success)
	) {
		return next(new Error('bad_request'));
	}
	if (!req.body || !req.body.path_cancel || !_.isString(req.body.path_cancel)) {
		return next(new Error('bad_request'));
	}

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
