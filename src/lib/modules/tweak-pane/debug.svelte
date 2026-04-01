<script lang="ts">
	import { onMount } from 'svelte';
	import DebugGridOverlay from './debug-grid-overlay.svelte';
	import DebugLayoutOverlay from './debug-layout-overlay.svelte';
	import TweakPane from './tweak-pane.svelte';
	import { dev } from '$app/environment';
	import { tweakPaneStore } from './tweak-pane-state.svelte.ts';

	onMount(() => {
		tweakPaneStore.initialize();
	});
</script>

{#if dev}
	<DebugGridOverlay visible={tweakPaneStore.showDebugGrid} />
	<DebugLayoutOverlay
		visible={tweakPaneStore.showDebugLayout}
		targetSelector=".app-content"
		columnsMobile={3}
		columnsTablet={8}
		columnsDesktop={12}
		columnGapMobile={8}
		columnGapTablet={12}
		columnGapDesktop={20}
	/>
	<TweakPane
		bind:showDebugGrid={tweakPaneStore.showDebugGrid}
		bind:showDebugLayout={tweakPaneStore.showDebugLayout}
		bind:contentMaxWidth={tweakPaneStore.contentMaxWidth}
	/>
{/if}
