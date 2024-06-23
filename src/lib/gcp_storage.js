// Modules
import { Storage } from '@google-cloud/storage';
import config from './config.js';

// https://googleapis.dev/nodejs/storage/latest/Storage.html
let storage = new Storage(config.GCP_STORAGE_CONFIG);

// TODO: Have not figured out how to do Jest ES Module mocks/stubs
//       So if you know, please open a PR. This is the stub for now
if (config.NODE_ENV === 'test') {
	storage = {
		bucket: function (param1) {
			return {
				file: function (param2) {
					return {
						getSignedUrl: async function (param3) {
							const url = [param1, param2, param3.version].join('-');
							return Promise.resolve([url]);
						},
					};
				},
			};
		},
	};
}

export default storage;
