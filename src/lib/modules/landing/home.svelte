<script lang="ts">
	import Snackbar from '@components/snackbar.svelte';

	let logoRef: HTMLElement | undefined = $state();
</script>

<section>
	<div class="content">
		<div class="logo" bind:this={logoRef}>
			<img src="/logo.png" alt="Museum Logo" />
		</div>
		<p class="heading">Heloworld</p>
		<p class="description">
			Every language has an origin story. <strong>Heloworld</strong> catalogues the people, problems,
			and moments that created the tools we code with today.
		</p>
		<a href="exhibition">Enter Museum</a>
	</div>
	<Snackbar />
</section>

<style>
	section {
		height: 100vh;
		width: 100%;
		position: relative;
		overflow: hidden;

		background-image: url('/background.png');
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
		background-repeat: no-repeat;

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

	.content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: env(--space-lg);

		.heading {
			color: var(--color-white);
			font-weight: bold;
			text-transform: uppercase;
			text-shadow: 0 4px 4px rgba(255, 255, 255, 0.5);
			letter-spacing: 10px;
			opacity: 0.8;
			font-size: 48rem;

			@media (-md) {
				font-size: 64rem;
			}
		}

		.description {
			text-align: center;
			width: 80%;
			color: var(--color-accent);

			@media (-md) {
				width: 60%;
			}
		}

		a {
			background: var(--color-accent);
			padding-block: env(--space-md);
			padding-inline: env(--space-lg);
			transition: transform 0.2s ease;
			will-change: transform;

			&:hover {
				transform: translateY(-2px);
			}
		}

		.logo {
			width: 200px;
			height: 200px;
			opacity: 0.8;
		}
	}
</style>
