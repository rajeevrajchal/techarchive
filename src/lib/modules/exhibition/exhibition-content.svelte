<script lang="ts">
	import { t } from '$lib/shared/i18n';
	import type { Language } from '$lib/shared/types/language';

	interface Props {
		languages: Language[];
	}

	let { languages }: Props = $props();

	let scrollEl: HTMLDivElement | undefined = $state();

	const handleScroll = () => {
		if (languages.length === 0) return;
		if (scrollEl === undefined) return;
		const index = Math.round(scrollEl.scrollLeft / scrollEl.clientWidth);
		console.log('scroll details', {
			index,
			sl: scrollEl.scrollLeft,
			cw: scrollEl.clientWidth
		});
	};
</script>

<div class="exhibition-content" bind:this={scrollEl} onscroll={handleScroll}>
	{#each languages as language (language.slug)}
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
	{/each}
</div>

<style>
	.exhibition-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: overflow;
		scroll-snap-type: y mandatory;
		scrollbar-width: none;
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
