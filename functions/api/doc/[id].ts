export const onRequestGet: PagesFunction<Environment> = async ({ env, params }) => {
	const doc = await env.DOCUMENTS.get(`doc:${params.id}`);

	if (!doc) {
		return new Response(`Document with ID of [${params.id}] not found.`, {
			status: 404,
		});
	}

	return new Response(JSON.stringify({ id: params.id, doc }), {
		status: 200,
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
	});
};
