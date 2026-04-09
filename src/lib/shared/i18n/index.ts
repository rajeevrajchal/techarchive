import { en } from './lang/en';
import { Translation } from './translate.svelte';

export const t = new Translation([{ locale: 'en-US', label: 'English (US)', messages: en }]);

export type TranslationKey = keyof (typeof t.locals)[0]['messages'];
