<script lang="ts">
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
		<div class="grid content">
			<a href={`/exhibition/${language.slug}`} class="item">
				<div class="row heading">
					<p class="text-xxl title">{language.slug}</p>
					<p class="text-xxl year">{language.born}</p>
				</div>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. At autem minima harum aut
					voluptatibus, est cum dolore suscipit quae. Ipsam architecto dolorum vero ducimus,
					laudantium reiciendis asperiores atque molestiae voluptatibus?
				</p>
				<div class="row">
					<button class="chip">Active</button>
					<button class="chip">highly use</button>
				</div>
			</a>
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

	.content {
		width: 100vw;
		height: 100%;
		flex-shrink: 0;
		scroll-snap-align: start;
	}

	.item {
		grid-column: 5 / span 4;
		flex: 0;
		align-self: center;
		background: rgba(255, 255, 255, 0.1);
		padding: env(--space-lg);
		display: flex;
		flex-direction: column;
		gap: env(--space-lg);

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
	}
</style>
