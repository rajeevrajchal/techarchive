import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	const modules = import.meta.glob('../../content/*.md', { eager: true });

	const languages = Object.entries(modules).map(([filePath, mod]) => {
		const slug = filePath.split('/').pop()?.replace('.md', '') ?? '';
		const meta = (mod as { metadata: Record<string, unknown> }).metadata ?? {};

		return {
			slug,
			title: (meta.title as string) ?? slug,
			description: (meta.description as string) ?? '',
			difficulty: (meta.difficulty as string) ?? '',
			tags: (meta.tags as string[]) ?? [],
			date: (meta.date as string) ?? '',
			category: (meta.category as string) ?? '',
			status: (meta.status as string) ?? ''
		};
	});

	return { languages };
};
