<script lang="ts">
	import { get_demon_knowledge_base, get_rule_knowledge_base } from '$lib';
	import { onMount } from 'svelte';

	let history: string[] = [];
	let current_command = $state('');

	let inputBox: HTMLTextAreaElement;

	let logText = $state('');

	let demon_info_button_clicked: boolean = false;
	let rule_button_clicked: boolean = false;
	let wasCtrl:boolean =false;

	function handleGlobalKey(event: KeyboardEvent):void {
		const isCtrl = event.ctrlKey || event.metaKey;
		if(wasCtrl && event.key == "v"){
			inputBox.focus();
		}
		if (isCtrl) {
			wasCtrl = true
			return;
		}
		inputBox.focus();
	}

	function putHistoryIntoLogBox(): void {
		logText = history.join('\n');
	}

	onMount(() => {
		window.addEventListener('keydown', handleGlobalKey);
		return () => window.removeEventListener('keydown', handleGlobalKey);
	});

	async function demon_knowledge_base_in_history_box(): Promise<void> {
		if (demon_info_button_clicked) {
			putHistoryIntoLogBox();
		} else {
			logText = await get_demon_knowledge_base();
		}

		demon_info_button_clicked = !demon_info_button_clicked;
	}

	async function rule_knowledge_base_in_history_box(): Promise<void> {
		if (rule_button_clicked) {
			putHistoryIntoLogBox();
		} else {
			logText = await get_rule_knowledge_base();
		}
		rule_button_clicked = !rule_button_clicked;
	}

	function handleKeydownInputBox(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			history.push(current_command);
			current_command = '';
			putHistoryIntoLogBox();
		}
	}
</script>

<div class="command-box">
	<textarea class="log-box" readonly>{logText}</textarea>
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

<div>
	<button class="show-button" onclick={demon_knowledge_base_in_history_box}>Show Demon Info</button>
	<button onclick={rule_knowledge_base_in_history_box}>Show Rules</button>
</div>

<style>
	.command-box {
		display: flex;
		flex-direction: column;
		border-style: solid;
	}

	.log-box {
		border: none;
		outline: none;
		resize: none;
		height: 50vh;
		width: 50vw;
	}

	.input-box {
		border: none;
		outline: none;
		resize: none;
		height: 1em;
	}
</style>
