<script>
	import { Menu } from '$lib/icon';
</script>

<button class="app-menu">
	<Menu />
</button>

<style>
	.app-menu {
		position: absolute;
		top: 40px;
		right: calc(env(--space-lg) * 2);
		z-index: 3;
	}
</style>
