<script lang="ts">
	import { ScrollPinning } from '$lib/shared/utils/scroll-pining';
	import { onMount } from 'svelte';

	const panels = [
		{ id: 'p1', label: 'Panel One', bg: '#0a0a0a', color: '#f5f5f0' },
		{ id: 'p2', label: 'Panel Two', bg: '#1a1a2e', color: '#e0c3ff' },
		{ id: 'p3', label: 'Panel Three', bg: '#0d2137', color: '#a8daff' },
		{ id: 'p4', label: 'Panel Four', bg: '#1a2e1a', color: '#a8ffb8' }
	];

	let panelEls: HTMLElement[] = $state([]);
	let stack: ScrollPinning | undefined = $state(undefined);

	onMount(() => {
		stack = new ScrollPinning(panelEls, {
			scrub: 1,
			scrollDuration: 1.2,
			onPanelEnter: (i) => console.log(`Panel ${i + 1} entered`)
		});

		return () => stack?.destroy();
	});
</script>

<nav class="panel-nav">
	{#each panels as panel, i (panel.id)}
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<button class="nav-dot" onclick={() => stack?.scrollTo(i)} aria-label="Go to {panel.label}" />
	{/each}
</nav>

<div class="scroll-wrapper">
	{#each panels as panel, i (panel.id)}
		<div
			bind:this={panelEls[i]}
			class="panel"
			style:background={panel.bg}
			style:color={panel.color}
			style:z-index={i + 1}
		>
			<span class="panel_index">0{i + 1}</span>
			<h2>{panel.label}</h2>
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
	}

	.panel-nav {
		position: fixed;
		right: 2rem;
		top: 50%;
		translate: 0 -50%;
		display: flex;
		flex-direction: column;
		gap: 10rem;
		z-index: 100;
	}

	.nav-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: white;
		opacity: 0.4;
		border: none;
		cursor: pointer;
		transition:
			opacity 0.2s,
			scale 0.2s;

		&:hover {
			opacity: 1;
			scale: 1.3;
		}
	}
</style>
