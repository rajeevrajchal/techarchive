import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	const modules = import.meta.glob('../../content/*.md', { eager: true });

	const languages = Object.entries(modules).map(([filePath, mod]) => {
		const slug = filePath.split('/').pop()?.replace('.md', '') ?? '';
		const meta = (mod as { metadata: Record<string, unknown> }).metadata ?? {};

		return {
			slug,
			title: (meta.title as string) ?? slug,
			born: meta.born ? new Date(meta.born as string) : new Date(0),
			description: (meta.description as string) ?? '',
			difficulty: (meta.difficulty as string) ?? '',
			tags: (meta.tags as string[]) ?? [],
			category: (meta.category as string) ?? '',
			status: (meta.status as string) ?? '',
			creator: (meta.creator as string) ?? '',
			maintainer: (meta.maintainer as string) ?? '',
			contributors: (meta.contributors as string[]) ?? [],
			docs: (meta.docs as { title: string; url: string }[]) ?? [],
			book: (meta.book as { title: string }[]) ?? []
		};
	});

	const sortedLanguages = languages.sort((a, b) => {
		return a.born.getTime() - b.born.getTime();
	});

	return { languages: sortedLanguages };
};
