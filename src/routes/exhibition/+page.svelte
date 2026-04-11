<script lang="ts">
	import ExhibitionBottomMenu from '@modules/exhibition/exhibition-bottom-menu.svelte';
	import ExhibitionMenu from '@modules/exhibition/exhibition-menu.svelte';
</script>

<section>
	<ExhibitionMenu />
	<div class="exhibition-content">
		<div class="item">the item</div>
	</div>
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

	.exhibition-content {
		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item {
		border: 1px solid red;
	}
</style>
