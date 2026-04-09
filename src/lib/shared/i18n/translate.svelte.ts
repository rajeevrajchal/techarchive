import { browser } from '$app/environment';
import {
	createIntl,
	type IntlConfig,
	type IntlShape,
	type FormatNumberOptions,
	type FormatDateOptions
} from '@formatjs/intl';

export type LocaleConfig = IntlConfig<string> & {
	label: string;
};

type ArrayOneOrMore<T> = {
	0: T;
} & Array<T>;

export const LOCALE_STORAGE_KEY = 'locale';

export class Translation<T extends LocaleConfig> {
	public locals: Record<string, T> = $state({});

	public availableLangs: string[] = $state([]);
	public lang: string = $state('');
	private intl: IntlShape | null = $state.raw(null);

	constructor(locals: ArrayOneOrMore<T>, defaultLocale?: string) {
		if (defaultLocale) this.lang = defaultLocale;
		else this.lang = locals[0].locale;

		locals.forEach((locale) => {
			this.register(locale);
		});

		if (browser) {
			const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
			if (stored && this.availableLangs.includes(stored)) {
				this.lang = stored;
			}
		}

		if (!this.locals[this.lang]) throw new Error(`Locale ${this.lang} is not registered`);

		this.intl = createIntl(this.locals[this.lang]);

		$effect.root(() => {
			window.addEventListener('storage', (event: StorageEvent) => {
				if (event.key === LOCALE_STORAGE_KEY) {
					if (event.newValue) {
						this.lang = event.newValue;
						window.localStorage.setItem(LOCALE_STORAGE_KEY, this.lang);
						this.intl = createIntl(this.locals[this.lang]);
					}
				}
			});

			$effect(() => {
				if (this.lang !== this.intl?.locale) {
					if (!this.locals[this.lang]) throw new Error(`Locale ${this.lang} is not registered`);
					window.localStorage.setItem(LOCALE_STORAGE_KEY, this.lang);
					this.intl = createIntl(this.locals[this.lang]);
				}
			});
		});
	}

	public get(
		key: keyof T['messages'],
		params?: Record<string, string | number | boolean | null | undefined | Date>,
		options?: Record<string, unknown>
	): string {
		if (!this.intl) throw new Error('No locale is registered');
		if (typeof key !== 'string') throw new Error('Key must be a string');
		return this.intl.formatMessage({ id: key }, params, options);
	}

	public number(value: number, options: FormatNumberOptions = { maximumFractionDigits: 2 }) {
		if (!this.intl) throw new Error('No locale is registered');
		return this.intl.formatNumber(value, options).replace(/\skr\.$/, ' kr');
	}

	public currency(
		value: number,
		options: FormatNumberOptions = { maximumFractionDigits: 2 }
	): string {
		if (!this.intl) throw new Error('No locale is registered');
		const resolved: FormatNumberOptions = {
			style: 'currency',
			currencyDisplay: 'code',
			maximumFractionDigits: 2,
			...options
		};

		return this.intl.formatNumber(value, resolved);
	}

	public date(value: Date, options: FormatDateOptions = {}) {
		if (!this.intl) throw new Error('No locale is registered');
		return this.intl.formatDate(value, options);
	}

	private register(config: T): void {
		if (this.locals[config.locale]) {
			throw new Error(`Locale ${config.locale} is already registered`);
		}
		this.availableLangs.push(config.locale);
		this.locals[config.locale] = config;
	}
}
