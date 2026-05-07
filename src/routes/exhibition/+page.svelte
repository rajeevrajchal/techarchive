<script lang="ts">
	import { ScrollPinning } from '$lib/shared/utils/scroll-pining';
	import ExhibitionContent from '@modules/exhibition/exhibition-content.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let panelEls: HTMLElement[] = $state([]);
	let stack: ScrollPinning | undefined = $state(undefined);
	let ratios: number[] = $state(new Array(data.languages.length).fill(0));

	onMount(() => {
		stack = new ScrollPinning(panelEls, {
			scrub: 1,
			scrollDuration: 1.2,
			onPanelEnter: (i) => console.log(`Panel ${i + 1} entered`),
			onPanelProgress: (i, ratio) => {
				// ratio = 0 when panel just became active
				// ratio = 1 when next panel is fully covering this one
				ratios[i] = ratio;
			}
		});

		return () => stack?.destroy();
	});

	$inspect(ratios);
</script>

<div class="scroll-wrapper">
	{#each data.languages as panel, i}
		<div bind:this={panelEls[i]} class="panel" style:z-index={i + 1}>
			<ExhibitionContent language={panel} />
		</div>
	{/each}
</div>

<style>
	.scroll-wrapper {
		width: 100%;
	}

	.panel {
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		background: #000000;
	}
</style>
