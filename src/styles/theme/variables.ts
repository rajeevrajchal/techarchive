import { colors } from './colors';

export const breakpoints = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px'
} as const;

export const Variables = {
	color: {
		light: colors.light,
		dark: colors.dark
	},
	space: {
		xs: '4px',
		sm: '8px',
		md: '16px',
		lg: '24px',
		xl: '32px',
		'2xl': '48px'
	},
	shadow: {
		sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
		md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
		lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
		xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
	},
	transition: {
		fast: '150ms ease',
		base: '250ms ease',
		slow: '350ms ease'
	},
	font: {
		sans: "'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		mono: "'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace"
	}
} as const;

export const Breakpoints = breakpoints;
