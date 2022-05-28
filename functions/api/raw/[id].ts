export const onRequestGet: PagesFunction<Environment> = async ({ env, params }) => {
	const doc = await env.DOCUMENTS.get(`doc:${params.id}`);

	if (!doc) {
		return new Response(`Document with ID of [${params.id}] not found.`, {
			status: 404,
		});
	}

	return new Response(doc, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=UTF-8",
		},
	});
};
