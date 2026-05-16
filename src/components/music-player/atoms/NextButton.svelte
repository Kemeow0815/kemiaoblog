<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		onclick: () => void;
	}

	const { onclick }: Props = $props();
</script>

<button
	class="p-2 rounded-full hover:bg-[var(--button-hover-color)] text-[var(--text-color)] transition-colors"
	aria-label="下一首"
	{onclick}
>
	<Icon icon="material-symbols:skip-next" class="text-2xl" />
</button>
