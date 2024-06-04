// Modules
import v from 'validator';
import debug from 'debug';
const log = debug('app:mw:load_referrer');

// Note: The header "Referer" is a mis-spelling of history.
// We only use "referer" for names referencing the header.
// All other usage internally uses the corrected "referrer"

// TODO: Update to consider UTM as sources too
function mw_load_referrer(req, res, next) {
	log('start');

	// referrer
	req.appdata.referrer = {
		source: 'organic', // Default
	};
	const header_referer = req.headers['referer'];
	// TODO: WHATWG URL Parser
	//const referrer = urlparse(header_referer).hostname;
	// Appends: referrer_raw, referring_domain, source
	if (header_referer !== undefined && header_referer !== '') {
		if (v.isURL(header_referer) === true) {
			const myURL = new URL(header_referer);
			log('HEADER: REFERER PARSED', myURL.hostname);
			req.appdata.referrer.raw = header_referer;
			req.appdata.referrer.domain = myURL.hostname;
			req.appdata.referrer.source = 'referral';
		} else {
			log('HEADER: REFERER INVALID', header_referer);
		}
	}

	log('end');
	return next();
}

export default mw_load_referrer;
