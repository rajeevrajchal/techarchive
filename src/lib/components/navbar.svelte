<script>
	import { Arrow } from '$lib/icon';
</script>

<nav>
	<button class="back" onclick={() => history.back()}>
		<Arrow arrow="left" />
		<p>Exhibition</p>
	</button>
</nav>

<style>
	nav {
		background: rgba(0, 0, 0, 0.4);
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		padding-inline: calc(env(--space-lg) * 2);
		padding-block: calc(env(--space-lg));
		z-index: 4;
	}

	.back {
		position: relative;
		display: flex;
		align-items: center;
		gap: env(--space-md);
		color: var(--color-text);
		z-index: 2;
	}
</style>
