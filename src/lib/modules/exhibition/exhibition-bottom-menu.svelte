<script>
	import { Arrow } from '$lib/icon';

	let timelineWidth = $state(1);
</script>

<nav>
	<button class="previous">
		<Arrow arrow="left" />
		<span>1998</span>
	</button>

	<div class="timeline-container">
		<p class="time">1999</p>
		<div class="timeline">
			<div class="line" style={`width: ${timelineWidth}%`}></div>
		</div>
		<p class="time">Present</p>
		<p class="hint">Scroll to slide</p>
	</div>

	<button class="next">
		<span>2000</span>
		<Arrow arrow="right" />
	</button>
</nav>

<style>
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

		.time {
			color: var(--color-white);
		}
		.hint {
			font-size: env(--space-md);
			color: var(--color-accent);
			position: absolute;
			bottom: calc(env(--space-lg) * -1);
			left: 50%;
			transform: translateX(-50%);
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

	button {
		background: none;
		border: none;
		cursor: pointer;

		color: var(--color-accent);
		display: flex;
		align-items: center;
		gap: env(--space-md);
	}

	.previous {
		justify-content: flex-start;
	}

	.next {
		width: 100%;
		justify-content: flex-end;
	}
</style>
