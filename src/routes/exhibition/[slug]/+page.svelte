<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let Post = $derived(data.content);
	let meta = $derived(data.metadata);
</script>

<article class="post">
	<header class="post-header">
		<h1 class="title">{meta.title}</h1>
		<p class="description">{meta.description}</p>
		<div class="meta-row">
			<span class="badge">{meta.difficulty}</span>
			<span class="date">{meta.date}</span>
		</div>
		{#if Array.isArray(meta.tags)}
			<ul class="tags">
				{#each meta.tags as tag (tag)}
					<li class="tag">{tag}</li>
				{/each}
			</ul>
		{/if}
	</header>

	<div class="prose">
		<Post />
	</div>
</article>

<style>
	.post {
		max-width: 720px;
		padding: env(--space-md);
	}

	.post-header {
		margin-bottom: env(--space-lg);
	}

	.title {
		margin-bottom: env(--space-sm);
	}

	.description {
		margin-bottom: env(--space-sm);
	}

	.meta-row {
		display: flex;
		gap: env(--space-sm);
		margin-bottom: env(--space-sm);
	}

	.badge {
		padding: env(--space-xs) env(--space-sm);
		background: env(--color-light-secondary);
	}

	.tags {
		display: flex;
		gap: env(--space-xs);
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.tag {
		padding: env(--space-xs) env(--space-sm);
	}
</style>
