<script lang="ts">
	import ExhibitionBottomMenu from '@modules/exhibition/exhibition-bottom-menu.svelte';
	import ExhibitionContent from '@modules/exhibition/exhibition-content.svelte';
	import ExhibitionMenu from '@modules/exhibition/exhibition-menu.svelte';
</script>

<section>
	<ExhibitionMenu />
	<ExhibitionContent />

	<ExhibitionBottomMenu />
</section>

<style>
	section {
		width: 100%;
		height: 100vh;
		position: relative;
		padding-inline: calc(env(--space-lg) * 2);
		z-index: 2;
	}
</style>
