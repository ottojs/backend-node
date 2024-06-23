// Modules
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import config from '../../lib/config.js';
import storage from '../../lib/gcp_storage.js';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
// application/octet-stream
const allowed_uploads = [
	{
		mime: 'audio/webm',
		type: 'audio',
		extensions: ['weba'],
	},
	{
		mime: 'image/jpeg',
		type: 'image',
		extensions: ['jpeg', 'jpg'],
	},
	{
		mime: 'image/png',
		type: 'image',
		extensions: ['png'],
	},
	{
		mime: 'image/webp',
		type: 'image',
		extensions: ['webp'],
	},
];

const upload_file_schema = z.object({
	// Required
	extension: z.string().trim().toLowerCase().min(2).max(5),
});

// TODO: Store creation in DB so we can trace origin
// TODO: Scan content for matching mime
async function r_v0_upload_url_post(req, res, next) {
	// Check body
	const check = upload_file_schema.safeParse(req.body);
	if (check.success === false) {
		return next(new Error('bad_request'));
	}

	// Grab upload type
	const upload_type = allowed_uploads.find(
		(item) => item.extensions.indexOf(check.data.extension) !== -1
	);
	if (!upload_type) {
		return next(new Error('bad_request'));
	}

	// Generate Upload URL
	const filename = `${randomUUID()}-${Date.now()}.${check.data.extension}`;
	const filepath = `content/${upload_type.type}/${filename}`;
	const [url] = await storage
		.bucket(config.GCP_BUCKET_NAME)
		.file(filepath)
		.getSignedUrl({
			version: 'v4',
			action: 'write',
			expires: Date.now() + config.GCP_UPLOAD_EXPIRE_TIME,
			contentType: upload_type.mime,
		});
	// Our example bucket is fully public but
	// you may also want to run .makePublic()

	// Response
	res.status(201);
	res.json({
		status: 'created',
		data: {
			filename,
			filepath,
			url,
			mime: upload_type.mime,
		},
	});
	return next();
}

export default r_v0_upload_url_post;
