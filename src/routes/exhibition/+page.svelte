<script lang="ts">
	import ExhibitionBottomMenu from '@modules/exhibition/exhibition-bottom-menu.svelte';
	import ExhibitionContent from '@modules/exhibition/exhibition-content.svelte';
	import ExhibitionMenu from '@modules/exhibition/exhibition-menu.svelte';

	let { data } = $props();
</script>

<section>
	<ExhibitionMenu />
	<ExhibitionContent languages={data.languages} />
	<ExhibitionBottomMenu
		currentIndex={1}
		total={data.languages.length}
		onPrev={() => {
			console.log('prevs');
		}}
		onNext={() => {
			console.log('prevs');
		}}
	/>
</section>

<style>
	section {
		width: 100%;
		height: 100vh;
		position: relative;
		z-index: 2;
	}
</style>
