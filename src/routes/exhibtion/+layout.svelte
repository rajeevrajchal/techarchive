<script>
	let { children } = $props();
</script>

<div class="container">
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 40px;
	}

	.content {
		flex: 1;
		align-self: stretch;
	}
</style>
