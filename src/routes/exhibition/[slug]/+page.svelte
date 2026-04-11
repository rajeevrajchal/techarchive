<script lang="ts">
	import { Arrow } from '$lib/icon';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let Post = $derived(data.content);
	let meta = $derived(data.metadata);
	let range = $derived(data.metadata.range.split('-'));
</script>

<section>
	<nav>
		<button class="back" onclick={() => history.back()}>
			<Arrow arrow="left" />
			<p>Exhibition</p>
		</button>
	</nav>

	<article class="post">
		<div class="header">
			<div class="name">
				<h1 class="title">{meta.title}</h1>
				<p class="description">{meta.description}</p>
				<div class="range">
					<p>{range[0]}</p>
					<p>{range[1]}</p>
				</div>
			</div>
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
		</div>

		<div class="content">
			<Post />
		</div>
	</article>
</section>

<style>
	section {
		height: 100vh;
		width: 100%;
		overflow: auto;
		position: relative;
	}

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

	article {
		width: var(--max-width);
		margin: 0 auto;
		position: relative;
		padding-inline: calc(env(--space-lg) * 2);
		padding-block: calc(env(--space-lg));
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: env(--space-lg);
	}

	.header {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-areas:
			'name'
			'author';
		gap: env(--space-lg);

		@media (--lg) {
			grid-template-columns: 1fr max-content;
			grid-template-areas:
				'name author'
				'name author';
		}
	}

	.name {
		display: flex;
		flex-direction: column;
		gap: env(--space-md);
	}

	.description {
		color: var(--color-se);
	}

	.title {
		text-transform: uppercase;
		font-size: 2rem;
	}

	.range {
		font-size: 24px;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: env(--space-md);
		text-transform: uppercase;
	}

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

	.content {
		margin-top: env(--space-lg);
		display: flex;
		flex-direction: column;
		gap: env(--space-lg);
	}
</style>
