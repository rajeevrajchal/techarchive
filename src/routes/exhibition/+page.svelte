<script lang="ts">
	import ExhibitionBottomMenu from '@modules/exhibition/exhibition-bottom-menu.svelte';
	import ExhibitionContent from '@modules/exhibition/exhibition-content.svelte';
	import ExhibitionMenu from '@modules/exhibition/exhibition-menu.svelte';

	let { data } = $props();

	let currentIndex = $state(0);
	let scrollController: { scrollTo?: (index: number) => void } = {};

	function handleIndexChange(index: number) {
		currentIndex = index;
	}

	function scrollPrev() {
		if (currentIndex > 0) {
			scrollController.scrollTo?.(currentIndex - 1);
		}
	}

	function scrollNext() {
		if (currentIndex < data.languages.length - 1) {
			scrollController.scrollTo?.(currentIndex + 1);
		}
	}
</script>

<section>
	<ExhibitionMenu />
	<ExhibitionContent
		languages={data.languages}
		onIndexChange={handleIndexChange}
		controller={scrollController}
	/>
	<ExhibitionBottomMenu
		{currentIndex}
		total={data.languages.length}
		onPrev={scrollPrev}
		onNext={scrollNext}
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
