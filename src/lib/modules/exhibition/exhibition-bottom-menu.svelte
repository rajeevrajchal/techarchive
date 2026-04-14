<script lang="ts">
	import { Arrow } from '$lib/icon';

	interface Props {
		currentIndex: number;
		total: number;
		onPrev: () => void;
		onNext: () => void;
	}

	let { currentIndex, total, onPrev, onNext }: Props = $props();

	let timelineWidth = $derived(total <= 1 ? 100 : (currentIndex / (total - 1)) * 100);
</script>

<nav>
	<button class="previous" onclick={onPrev} disabled={currentIndex === 0}>
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

	<button class="next" onclick={onNext} disabled={currentIndex === total - 1}>
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
			transition: width env(--transition-base);
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
		transition: opacity env(--transition-base);
	}

	button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.previous {
		justify-content: flex-start;
	}

	.next {
		width: 100%;
		justify-content: flex-end;
	}
</style>
