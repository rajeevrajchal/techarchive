export interface ExhibitionMeta {
	title: string;
	description: string;
	born: string;
	range: string;
	tags: string[];
	category: string;
	status: string;
	difficulty: string;
	creator: string;
	maintainer: string;
	contributors: string[];
	docs: { title: string; url: string }[];
	books: { title: string }[];
}
