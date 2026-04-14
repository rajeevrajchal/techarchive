<script lang="ts">
	import Navbar from '@components/navbar.svelte';
	import type { PageProps } from './$types';
	import Author from '@modules/exhibition/detail/author.svelte';

	let { data }: PageProps = $props();

	let Post = $derived(data.content);
	let meta = $derived(data.metadata);
	let range = $derived(data.metadata.range.split('-'));
</script>

<section>
	<Navbar />

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
			<Author {meta} />
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
		font-size: 32rem;
	}

	.range {
		font-size: 24rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: env(--space-md);
		text-transform: uppercase;
	}

	.content {
		margin-top: env(--space-lg);
		display: flex;
		flex-direction: column;
		gap: env(--space-lg);
	}
</style>
