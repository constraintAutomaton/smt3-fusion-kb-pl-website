<script lang="ts">
	import { get_demon_knowledge_base, get_rule_knowledge_base } from '$lib';

	let history:string[] = [];

	let historyText = $state('');

	async function demon_knowledge_base_in_history_box() {
		historyText = await get_demon_knowledge_base();
	}

	async function rule_knowledge_base_in_history_box() {
		historyText = await get_rule_knowledge_base();
	}
</script>

<div class="command-box">
	<textarea class="history-box" readonly>{historyText}</textarea>
	<input type="text" class="input-box" value="?- " />
</div>

<div>
	<button onclick={demon_knowledge_base_in_history_box}>Show Demon Info</button>
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
	}
</style>
