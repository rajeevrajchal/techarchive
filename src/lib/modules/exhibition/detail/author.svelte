<script lang="ts">
	import type { ExhibitionMeta } from '@modules/exhibition/types';

	let {
		meta
	}: {
		meta: ExhibitionMeta;
	} = $props();
</script>

<div class="author">
	<div class="row">
		<div class="col section">Creator</div>
		<div class="col val">{meta.creator}</div>
	</div>
	<div class="row">
		<div class="col section">Maintainer</div>
		<div class="col val">{meta.maintainer}</div>
	</div>
	<div class="row">
		<div class="col section">Difficulty</div>
		<div class="col val">{meta.difficulty}</div>
	</div>
	<div class="row">
		<div class="col section">Status</div>
		<div class="col val">{meta.status}</div>
	</div>
</div>

<style>
	.author {
		grid-area: author;
		display: flex;
		flex-direction: column;
		gap: env(--space-lg);

		@media (--lg) {
			min-height: 200px;
			min-width: 400px;
			padding-inline: env(--space-lg);
			padding-block: env(--space-md);
			border-radius: 6px;
			background: rgba(0, 0, 0, 0.1);
		}
	}

	.row {
		display: flex;
		flex-direction: column;
		gap: env(--space-xs);

		.section {
			text-transform: uppercase;
			font-size: 16px;
			font-weight: 600;
		}

		.val {
			color: var(--color-white);
			opacity: 0.8;
			text-transform: capitalize;
		}
	}
</style>
