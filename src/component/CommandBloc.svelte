<script lang="ts">
	import { get_demon_knowledge_base, get_rule_knowledge_base, queryProlog } from '$lib';
	import { isResult } from 'result-interface';
	import { onMount } from 'svelte';

	const contactProviderMessage =
		'was not able to access the knowledge base. Open an issue at https://github.com/constraintAutomaton/smt3-fusion-kb-pl-website/issues.';

	let history: string[] = [];
	let current_command = $state('');

	let inputBox: HTMLTextAreaElement;

	let logText = $state('');

	let demon_info_button_clicked: boolean = false;
	let rule_button_clicked: boolean = false;
	let wasCtrl: boolean = false;

	function handleGlobalKey(event: KeyboardEvent): void {
		const isCtrl = event.ctrlKey || event.metaKey;
		if (wasCtrl && event.key == 'v') {
			inputBox.focus();
		}
		if (isCtrl) {
			wasCtrl = true;
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
			const res = await get_demon_knowledge_base();
			if (isResult(res)) {
				logText = res.value;
			} else {
				console.error('error to report:', res.error);
				alert(contactProviderMessage);
			}
		}

		demon_info_button_clicked = !demon_info_button_clicked;
	}

	async function rule_knowledge_base_in_history_box(): Promise<void> {
		if (rule_button_clicked) {
			putHistoryIntoLogBox();
		} else {
			const res = await get_rule_knowledge_base();
			if (isResult(res)) {
				logText = res.value;
			} else {
				console.error('error to report:', res.error);
				alert(contactProviderMessage);
			}
		}
		rule_button_clicked = !rule_button_clicked;
	}

	async function handleKeydownInputBox(event: KeyboardEvent): Promise<void> {
		if (event.key === 'Enter') {
			event.preventDefault();
			history.push(current_command);
			putHistoryIntoLogBox();
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
