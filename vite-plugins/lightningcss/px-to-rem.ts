import type {
	CustomAtRules,
	LengthValue,
	TokenOrValue,
	UnparsedProperty,
	Visitor
} from 'lightningcss';

const PX_TO_REM_BASE = 16;
const MIN_PX_VALUE = 2;

const REM_PROPERTIES = new Set([
	'font-size',
	'letter-spacing',
	'word-spacing',
	'margin',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'margin-block',
	'margin-block-start',
	'margin-block-end',
	'margin-inline',
	'margin-inline-start',
	'margin-inline-end',
	'padding',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'padding-block',
	'padding-block-start',
	'padding-block-end',
	'padding-inline',
	'padding-inline-start',
	'padding-inline-end',
	'gap',
	'row-gap',
	'column-gap'
]);

// Converts a px LengthValue to rem — type-safe against LightningCSS's actual LengthValue type
function convertPxToRem(length: LengthValue): LengthValue {
	if (length.unit === 'px' && length.value >= MIN_PX_VALUE) {
		return {
			unit: 'rem',
			value: Number((length.value / PX_TO_REM_BASE).toFixed(3))
		};
	}
	return length;
}

// Maps over UnparsedProperty tokens, converting px lengths in-place
// TokenOrValue is a strict discriminated union — we must narrow on token.type === 'length'
function convertUnparsedTokens(unparsed: UnparsedProperty): UnparsedProperty {
	const converted: TokenOrValue[] = unparsed.value.map((token: TokenOrValue): TokenOrValue => {
		// Only the 'length' variant has a LengthValue — discriminated union narrowing
		if (token.type === 'length') {
			return {
				type: 'length', // literal type preserved ✅
				value: convertPxToRem(token.value)
			};
		}
		return token;
	});

	return { ...unparsed, value: converted };
}

export function pxToRem(): Visitor<CustomAtRules> {
	// Track whether the current declaration is in our allowlist
	// Declaration visitor fires before Length visitor for the same property
	let shouldConvert = false;

	return {
		Declaration(decl) {
			// decl.property is the discriminant — 'unparsed' | 'custom' | known property name
			if (decl.property === 'unparsed') {
				// UnparsedProperty carries propertyId.property as the real name
				const propName = decl.value.propertyId.property;
				shouldConvert = REM_PROPERTIES.has(propName);

				if (shouldConvert) {
					// Return a fully typed UnparsedProperty declaration
					return {
						property: 'unparsed',
						value: convertUnparsedTokens(decl.value)
					};
				}

				return decl;
			}

			if (decl.property === 'custom') {
				shouldConvert = false;
				return decl;
			}

			// Known parsed property — set flag so Length visitor handles it
			shouldConvert = REM_PROPERTIES.has(decl.property);
			return decl;
		},

		// Fires for parsed (typed) property values — e.g. font-size, padding shorthand
		// Only runs when shouldConvert is true from Declaration above
		Length(length) {
			if (shouldConvert) {
				return convertPxToRem(length);
			}
			return length;
		}
	};
}
