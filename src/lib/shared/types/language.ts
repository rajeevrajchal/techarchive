export type Language = {
	slug: string;
	title: string;
	date: string;
	tags: Array<string>;
	description: string;
	category: string;
	status: string;
	difficulty: string;
	content?: string; // optional: only present when using fs/gray-matter path
};
