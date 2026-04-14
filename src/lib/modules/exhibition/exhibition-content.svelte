<script lang="ts">
	import { onMount } from 'svelte';

	import type { Language } from './types';

	interface Props {
		languages: Language[];
		onIndexChange: (index: number) => void;
		controller: { scrollTo?: (index: number) => void };
	}

	let { languages, onIndexChange, controller }: Props = $props();

	let scrollEl: HTMLDivElement | undefined = $state();

	onMount(() => {
		controller.scrollTo = (index: number) => {
			if (scrollEl === undefined) return;

			scrollEl.scrollTo({
				left: index * scrollEl.clientWidth,
				behavior: 'smooth'
			});
		};

		const handleResize = () => {
			if (scrollEl === undefined) return;
			const index = Math.round(scrollEl.scrollLeft / scrollEl.clientWidth);
			scrollEl.scrollTo({ left: index * scrollEl.clientWidth, behavior: 'instant' });
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	function handleScroll() {
		if (languages.length === 0) return;
		if (scrollEl === undefined) return;
		const index = Math.round(scrollEl.scrollLeft / scrollEl.clientWidth);
		onIndexChange(index);
	}
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
		overflow-x: scroll;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
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
