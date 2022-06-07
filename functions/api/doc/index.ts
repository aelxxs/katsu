const THREE_MONTHS = 7.884e6;
const DICT =
	"abcdefghijklmnopqrstuvwxyz" + // -
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
	"0123456789";

function uid(len = 6): string {
	let out = "";

	for (let i = 0; i < len; i++) {
		out += DICT[~~(Math.random() * DICT.length)];
	}

	return out;
}

export const onRequestPost: PagesFunction<Environment> = async ({ env, request }) => {
	const docLength = +(request.headers.get("Content-Length") ?? 0);

	if (!docLength || docLength > 100000) {
		return new Response(`Document size must be between 0 and 100000 characters.`, {
			status: 400,
		});
	}

	const id = uid();
	const doc = await request.text();

	await env.DOCUMENTS.put(`doc:${id}`, doc, {
		expirationTtl: THREE_MONTHS,
	});

	return new Response(JSON.stringify({ id, url: `${request.url}/${id}` }), {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
	});
};
