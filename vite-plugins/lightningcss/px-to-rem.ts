import type { CustomAtRules, Visitor } from 'lightningcss';

const PX_TO_REM_BASE = 16;

export function pxToRem(): Visitor<CustomAtRules> {
	return {
		Length(length) {
			if (length.unit === 'px' && length.value !== 0) {
				return {
					unit: 'rem',
					value: Number((length.value / PX_TO_REM_BASE).toFixed(3))
				};
			}
			return length;
		}
	};
}
