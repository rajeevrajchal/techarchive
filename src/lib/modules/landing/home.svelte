<section>
	<div class="content">collection of tech</div>
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

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 1;
			background: rgba(0, 0, 0, 0.8);
		}
	}

	.content {
		position: relative;
		z-index: 2;
	}
</style>
