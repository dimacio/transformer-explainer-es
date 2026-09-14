<script lang="ts">
	import type { PopoverProps } from 'flowbite-svelte/Popover.svelte';
	import CommonPopover from './CommonPopover.svelte';

	export let offset: PopoverProps['offset'] = undefined;
	export let className: PopoverProps['class'] = undefined;
	export let triggeredBy: PopoverProps['triggeredBy'] = undefined;
	export let trigger: PopoverProps['trigger'] = undefined;
	export let placement: PopoverProps['placement'] = undefined;
</script>

<CommonPopover
	className="ln-popover"
	title="Normalización por capa"
	{offset}
	{triggeredBy}
	{trigger}
	{placement}
	goTo="article-ln"
>
	<div class="ln-content">
		Normaliza la entrada de la capa para que tenga una distribución estándar y gane estabilidad.
	</div></CommonPopover
>

<style lang="scss">
	.ln-content {
		width: 12rem;
	}
</style>
