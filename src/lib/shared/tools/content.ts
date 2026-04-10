import path from 'path';
import fs from 'fs';

import matter from 'gray-matter';
import { marked } from 'marked';
import type { Language } from '../types/language';

export const CONTENT_DIR = path.resolve('src/content');

export const slugFromFilename = (filename: string): string => {
	return path.basename(filename, '.md');
};

export const parseLanguageFile = (filepath: string): Language => {
	const raw = fs.readFileSync(filepath, 'utf-8');
	const { data, content } = matter(raw);
	return {
		slug: slugFromFilename(filepath),
		...data,
		content: marked(content) as string
	} as Language;
};

export const getAllLanguages = async (): Promise<Language[]> => {
	const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
	return files.map((f) => parseLanguageFile(path.join(CONTENT_DIR, f)));
};

export function getLanguage(slug: string) {
	const filepath = path.join(CONTENT_DIR, `${slug}.md`);
	if (!fs.existsSync(filepath)) return null;
	return parseLanguageFile(filepath);
}
