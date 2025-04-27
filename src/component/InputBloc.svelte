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

	onMount(() => {
		window.addEventListener('keydown', generateGlobalKeyHandling(inputBox));
		return () => window.removeEventListener('keydown', generateGlobalKeyHandling(inputBox));
	});

	async function handleKeydownInputBox(event: KeyboardEvent): Promise<void> {
		if (event.key === 'Enter') {
			if (current_command.slice(-1) !== '.') {
				current_command += '.';
			}
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
	<div style="display: flex;">
		<span style="display: inline-block;">?- </span>
		<textarea
			class="input-box"
			style="inline-flex; flex-grow:1;"
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
