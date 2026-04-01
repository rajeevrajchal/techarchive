<script lang="ts">
	import { onMount } from 'svelte';

	import { Breakpoints } from '@theme';

	interface Props {
		visible: boolean;
		targetSelector?: string;
		columnsMobile?: number;
		columnsTablet?: number;
		columnsDesktop?: number;
		columnGapMobile?: number;
		columnGapTablet?: number;
		columnGapDesktop?: number;
		opacity?: number;
		color?: string;
	}

	const MD_BREAKPOINT = Number.parseInt(Breakpoints.md, 10);
	const LG_BREAKPOINT = Number.parseInt(Breakpoints.lg, 10);

	let {
		visible,
		targetSelector = '.app-content',
		columnsMobile = 3,
		columnsTablet = 8,
		columnsDesktop = 12,
		columnGapMobile = 8,
		columnGapTablet = 12,
		columnGapDesktop = 20,
		opacity = 0.22,
		color = 'var(--color-accent)'
	}: Props = $props();

	let frameLeft = $state(0);
	let frameWidth = $state(0);
	let viewportWidth = $state(0);

	let activeColumns = $derived(
		viewportWidth < MD_BREAKPOINT
			? columnsMobile
			: viewportWidth < LG_BREAKPOINT
				? columnsTablet
				: columnsDesktop
	);
	let activeGap = $derived(
		viewportWidth < MD_BREAKPOINT
			? columnGapMobile
			: viewportWidth < LG_BREAKPOINT
				? columnGapTablet
				: columnGapDesktop
	);
	let columnWidth = $derived(
		Math.max(
			0,
			(frameWidth - (Math.max(activeColumns, 1) - 1) * activeGap) / Math.max(activeColumns, 1)
		)
	);

	onMount(() => {
		const targetElement = document.querySelector(targetSelector);
		if (!(targetElement instanceof HTMLElement)) return;

		const updateFrame = () => {
			const rect = targetElement.getBoundingClientRect();
			frameLeft = rect.left;
			frameWidth = rect.width;
		};

		const updateViewport = () => {
			viewportWidth = window.innerWidth;
		};

		const observer = new ResizeObserver(updateFrame);

		updateViewport();
		updateFrame();
		observer.observe(targetElement);
		window.addEventListener('resize', updateViewport);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', updateViewport);
		};
	});
</script>

<div
	class="debug-layout-overlay"
	style={`
		--debug-layout-left: ${frameLeft}px;
		--debug-layout-width: ${frameWidth}px;
		--debug-layout-opacity: ${visible ? opacity : 0};
		--debug-layout-gap: ${activeGap}px;
		--debug-layout-column: ${columnWidth}px;
		--debug-layout-color: ${color};
	`}
></div>

<style>
	.debug-layout-overlay {
		position: fixed;
		top: 0;
		left: var(--debug-layout-left);
		width: var(--debug-layout-width);
		height: 100dvh;
		pointer-events: none;
		z-index: 998;
		opacity: var(--debug-layout-opacity);
		transition: opacity env(--transition-fast);
		background-image: repeating-linear-gradient(
			to right,
			color-mix(in oklab, var(--debug-layout-color) 35%, transparent) 0,
			color-mix(in oklab, var(--debug-layout-color) 35%, transparent) var(--debug-layout-column),
			transparent var(--debug-layout-column),
			transparent calc(var(--debug-layout-column) + var(--debug-layout-gap))
		);
		background-size: calc(var(--debug-layout-column) + var(--debug-layout-gap)) 100%;
		background-position: left top;
	}
</style>
