// Modules
import Stripe from 'stripe';
import config from '../../lib/config.js';

// Initialize Stripe
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
	apiVersion: config.STRIPE_API_VERSION,
});

// https://docs.stripe.com/checkout/quickstart
// https://docs.stripe.com/api/checkout/sessions/create
async function r_v0_checkout_get(req, res, next) {
	const checkout_session = await stripe.checkout.sessions.create({
		line_items: [
			{
				// One-Time Purchase
				price: config.STRIPE_ONETIME_PRICE_ID,
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: config.APP_URI + '/checkout?success=1',
		cancel_url: config.APP_URI + '/checkout?cancel=1',
		automatic_tax: { enabled: true },
		// Set this if you want to pre-fill customer email
		// customer_email: 'user@example.com',
	});

	// Response
	res.status(302);
	res.redirect(checkout_session.url);
	return next();
}

export default r_v0_checkout_get;
