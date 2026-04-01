<script lang="ts">
	interface Props {
		visible: boolean;
		size?: number;
		opacity?: number;
		color?: string;
	}

	let { visible, size = 24, opacity = 0.15, color = 'var(--color-accent)' }: Props = $props();
</script>

<div
	class="debug-grid-overlay"
	style={`
		--debug-grid-size: ${size}px;
		--debug-grid-opacity: ${visible ? opacity : 0};
		--debug-grid-color: ${color};
	`}
></div>

<style>
	.debug-grid-overlay {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 999;
		opacity: var(--debug-grid-opacity);
		transition: opacity env(--transition-fast);
		background-image:
			linear-gradient(to right, var(--debug-grid-color) 1px, transparent 1px),
			linear-gradient(to bottom, var(--debug-grid-color) 1px, transparent 1px);
		background-size: var(--debug-grid-size) var(--debug-grid-size);
	}
</style>
