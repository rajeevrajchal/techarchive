<script lang="ts">
	import ExhibitionContent from '@modules/exhibition/exhibition-content.svelte';

	let { data } = $props();
	let sectionEl: HTMLElement | undefined = $state();
	let panels: HTMLElement[] = $state([]);

	$inspect('element', sectionEl?.clientHeight);
	const onScroll = (e: Event) => {
		console.log('scroll', e);
	};
</script>

<div class="custom-scrollbar" onscroll={onScroll}>
	{#each data.languages as _}
		<div class="panel"></div>
	{/each}
</div>

<section bind:this={sectionEl}>
	{#each data.languages as language, i}
		<div class="panel" bind:this={panels[i]}>
			<ExhibitionContent {language} />
		</div>
	{/each}
</section>

<style>
	section {
		position: relative;
		overflow: hidden;
		position: absolute;
		inset: 0;
		z-index: 3;
	}

	.custom-scrollbar {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		overflow-y: scroll;
	}

	.panel {
		width: 100vw;
		height: 100vh;
		border: 1px solid green;
	}
</style>
