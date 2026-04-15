<script>
	import { Code } from '$lib/icon';
</script>

<div class="container">
	<div class="snackbar">
		<div class="icon">
			<Code />
		</div>
		<p class="title">ALGOL 68</p>
		<p class="description">The language that influenced a generation of programming</p>
	</div>
</div>

<style>
	.container {
		position: fixed;
		bottom: env(--space-md);
		right: 0;
		z-index: 1;
	}

	.snackbar {
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-template-areas: 'icon title' 'icon description';
		column-gap: env(--space-md);
		row-gap: env(--space-sm);
		overflow: hidden;

		background: rgba(255, 255, 255, 0.1);
		width: 400px;

		.icon {
			background: var(--color-accent);
			width: 100px;
			height: auto;
			grid-area: icon;
			opacity: 0.3;
			:global(svg) {
				width: 100%;
				height: 100%;
				padding: env(--space-md);
			}
		}

		.title {
			font-weight: bold;
			grid-area: title;
			padding-top: env(--space-sm);
		}

		.description {
			grid-area: description;
			padding-bottom: env(--space-sm);
			color: var(--color-accent);
		}
	}
</style>
