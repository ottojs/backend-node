// Modules
import helmet from 'helmet';
import config from '../lib/config.js';

const mw_helmet = helmet({
	// xFrameOptions: false,
	strictTransportSecurity: config.IS_PRODUCTION,
	contentSecurityPolicy: {
		directives: {
			defaultSrc: [`'none'`],
			scriptSrc: [`'none'`],
			styleSrc: [`'none'`],
			imgSrc: [`'none'`],
			connectSrc: [`'none'`],
			fontSrc: [`'none'`],
			objectSrc: [`'none'`],
			mediaSrc: [`'none'`],
			frameSrc: [`'none'`],
			reportUri: '/csp-report',
			formAction: [`'self'`],
			frameAncestors: [`'none'`],
			baseUri: [`'self'`],
			manifestSrc: [`'none'`],
		},
	},
});

export default mw_helmet;
