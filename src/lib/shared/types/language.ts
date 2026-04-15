export type Language = {
	slug: string;
	title: string;
	born: Date;
	tags: string[];
	description: string;
	category: string;
	status: string;
	difficulty: string;
	creator: string;
	maintainer: string;
	contributors: string[];
	docs: {
		title: string;
		url: string;
	}[];
	book: {
		title: string;
	}[];
	content?: string; // optional: only present when using fs/gray-matter path
};
