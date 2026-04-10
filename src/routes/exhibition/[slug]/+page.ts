import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../content/${params.slug}.md`);
		return {
			content: post.default,
			metadata: post.metadata as Record<string, unknown>
		};
	} catch {
		error(404, `Language "${params.slug}" not found`);
	}
};
