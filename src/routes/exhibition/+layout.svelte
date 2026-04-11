<script lang="ts">
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
</script>

<div class="container">
	<div class="content"></div>
	{@render children()}
</div>

<style>
	.container {
		height: 100vh;
		width: 100%;
		position: relative;
		overflow: hidden;

		background-image: url('/background.png');
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		background-repeat: no-repeat;
		z-index: 2;

		display: flex;
		align-items: center;
		justify-content: center;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 1;
			background: rgba(0, 0, 0, 0.6);
		}
	}
</style>
