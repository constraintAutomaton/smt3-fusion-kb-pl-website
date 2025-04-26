<script lang="ts">
	import { queryProlog, generateGlobalKeyHandling } from '$lib';
	import { isResult } from 'result-interface';
	import { onMount } from 'svelte';

	interface IPropInputBloc {
		history: string[];
	}

	let { history = $bindable([]) }: IPropInputBloc = $props();

	let current_command = $state('');

	let inputBox: HTMLTextAreaElement;

	let wasCtrl: boolean = false;

	onMount(() => {
		window.addEventListener('keydown', generateGlobalKeyHandling(wasCtrl, inputBox));
		return () =>
			window.removeEventListener('keydown', generateGlobalKeyHandling(wasCtrl, inputBox));
	});

	async function handleKeydownInputBox(event: KeyboardEvent): Promise<void> {
		if (event.key === 'Enter') {
			event.preventDefault();
			history.push(current_command);
			const result = await queryProlog(current_command);
			if (isResult(result)) {
				for (const answer of result.value) {
					console.log(answer);
				}
			}
			current_command = '';
		}
	}
</script>

<div class="command-box">
	<div>
		<span style="display: inline-block;">?- </span>
		<textarea
			class="input-box"
			style="display: inline-block;"
			onkeydown={handleKeydownInputBox}
			bind:this={inputBox}
			bind:value={current_command}
		></textarea>
	</div>
</div>

<style>
	.input-box {
		border: none;
		outline: none;
		resize: none;
		height: 1em;
	}
</style>
