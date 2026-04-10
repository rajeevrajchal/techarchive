<script lang="ts">
	import { Arrow } from '$lib/icon';

	let timelineWidth = $state(1);
</script>

<section>
	<nav>
		<div class="action">
			<button>
				<Arrow arrow="left" />
			</button>
			<button>
				<Arrow arrow="right" />
			</button>
		</div>

		<div class="timeline-container">
			<p class="time">1999</p>
			<div class="timeline">
				<div class="line" style={`width: ${timelineWidth}%`}></div>
			</div>
			<p class="time">Present</p>
		</div>
		<div class="active">active</div>
	</nav>
</section>

<style>
	section {
		width: 100%;
		height: 100vh;
		position: relative;
		padding-inline: calc(env(--space-lg) * 2);
	}

	nav {
		position: absolute;
		bottom: 40px;
		left: 0;
		width: 100%;
		padding-inline: calc(env(--space-lg) * 2);

		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		align-items: center;
		gap: env(--space-lg);
	}

	.timeline-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: env(--space-lg);
		p {
			color: var(--color-secondary);
		}
	}

	.timeline {
		align-self: center;
		background: var(--color-secondary);
		width: 100%;
		height: 10px;
		border-radius: 5px;
		overflow: hidden;
		position: relative;

		.line {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			background: var(--color-accent);
		}
	}

	.action {
		align-self: flex-start;
		color: var(--color-secondary);
		display: flex;
		align-items: center;
		gap: calc(env(--space-lg) * 2);

		button {
			background: none;
			border: none;
			color: var(--color-secondary);
			cursor: pointer;
		}
	}

	.active {
		align-self: flex-end;
		text-align: right;
	}
</style>
