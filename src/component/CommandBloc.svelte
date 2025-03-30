<script lang="ts">
	import { get_demon_knowledge_base, get_rule_knowledge_base } from '$lib';

	let history: string[] = [];
	let current_command = $state('');

	let history_text = $state('');

	let demon_info_button_clicked: boolean = false;
	let rule_button_clicked: boolean = false;

	async function demon_knowledge_base_in_history_box(): Promise<void> {
		if (demon_info_button_clicked) {
			history_text = history.join('\n');
		} else {
			history_text = await get_demon_knowledge_base();
		}

		demon_info_button_clicked = !demon_info_button_clicked;
	}

	async function rule_knowledge_base_in_history_box(): Promise<void> {
		if (rule_button_clicked) {
			history_text = history.join('\n');
		} else {
			history_text = await get_rule_knowledge_base();
		}
		rule_button_clicked = !rule_button_clicked;
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			history.push(current_command);
			current_command = '';
		}
	}
</script>

<div class="command-box">
	<textarea class="history-box" readonly>{history_text}</textarea>
	<div>
		<span style="display: inline-block;">?- </span>
		<textarea
			class="input-box"
			style="display: inline-block;"
			onkeydown={handleKeydown}
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

	.history-box {
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
