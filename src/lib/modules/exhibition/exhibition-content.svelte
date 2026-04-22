<script lang="ts">
	import { t } from '$lib/shared/i18n';
	import type { Language } from '$lib/shared/types/language';

	interface Props {
		language: Language;
	}

	let { language }: Props = $props();
</script>

<div class="exhibition-content">
	<div class="grid">
		<div class="content">
			<div class="row heading">
				<p class="text-xxl title">{language.slug}</p>
				<p class="text-xxl year">
					{t.date(language.born, {
						year: 'numeric'
					})}
				</p>
			</div>

			<div class="row tags">
				<button class="chip">Active</button>
				<button class="chip">highly use</button>
			</div>

			<p class="text-lg description">
				{language.description}
			</p>

			<a href={`/exhibition/${language.slug}`} class="more">Read More</a>
		</div>
	</div>
</div>

<style>
	.exhibition-content {
		height: 100%;
		width: 100%;
		background: red;
	}

	.exhibition-content::-webkit-scrollbar {
		display: none;
	}

	.grid {
		width: 100%;
		height: 100%;
		flex-shrink: 0;
		scroll-snap-align: start;
	}

	.content {
		grid-column: 2 / span 10;
		padding-block: env(--space-xxl);
		display: flex;
		flex-direction: column;
		gap: env(--space-lg);
	}

	.heading {
		justify-content: space-between;
		align-items: flex-start;
	}

	.title {
		font-size: 34rem;
		text-transform: uppercase;
	}

	.year {
		font-size: 34rem;
	}

	a {
		background: var(--color-accent);
		padding-block: env(--space-md);
		padding-inline: env(--space-lg);
		transition: transform 0.2s ease;
		will-change: transform;
		width: fit-content;
		align-self: center;

		&:hover {
			transform: translateY(-2px);
		}
	}
</style>
