<script lang="ts">
	import '@styles/css/reset.css';
	import '@styles/css/global.css';

	import Debug from '@modules/tweak-pane/debug.svelte';
	import DocumentHead from '@components/document-head.svelte';
	// import Header from '@components/header.svelte';

	let { children } = $props();
</script>

<DocumentHead />
<!-- <Header /> -->
<main class="app-content">
	{@render children()}
</main>
<Debug />
