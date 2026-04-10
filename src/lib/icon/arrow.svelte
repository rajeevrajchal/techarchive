<script lang="ts">
	let { arrow }: { arrow: 'left' | 'right' } = $props();
</script>

{#if arrow === 'right'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-move-right-icon lucide-move-right"
		><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg
	>
{:else}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-move-left-icon lucide-move-left"
		><path d="M6 8L2 12L6 16" /><path d="M2 12H22" /></svg
	>
{/if}
