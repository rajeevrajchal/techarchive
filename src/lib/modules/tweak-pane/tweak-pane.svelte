<script lang="ts">
	import { Button, Checkbox, Pane, Slider } from 'svelte-tweakpane-ui';

	import { DEFAULT_TWEAK_STATE } from '@modules/tweak-pane/tweak-state';

	interface Props {
		showDebugGrid?: boolean;
		showDebugLayout?: boolean;
		contentMaxWidth?: number;
	}

	let {
		showDebugGrid = $bindable(DEFAULT_TWEAK_STATE.showDebugGrid),
		showDebugLayout = $bindable(DEFAULT_TWEAK_STATE.showDebugLayout),
		contentMaxWidth = $bindable(DEFAULT_TWEAK_STATE.contentMaxWidth)
	}: Props = $props();

	function resetControls(): void {
		showDebugGrid = DEFAULT_TWEAK_STATE.showDebugGrid;
		showDebugLayout = DEFAULT_TWEAK_STATE.showDebugLayout;
		contentMaxWidth = DEFAULT_TWEAK_STATE.contentMaxWidth;
	}
</script>

<Pane position="draggable" title="Tweak" expanded={true} width={300}>
	<Checkbox bind:value={showDebugGrid} label="Debug Grid" />
	<Checkbox bind:value={showDebugLayout} label="Debug Layout" />
	<Slider bind:value={contentMaxWidth} label="Max Width" min={640} max={1440} step={20} />
	<Button title="Reset" on:click={resetControls} />
</Pane>
