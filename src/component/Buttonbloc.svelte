<script lang="ts">
	import { get_demon_knowledge_base, get_rule_knowledge_base } from '$lib';
	import { isResult } from 'result-interface';

	interface IPropButtonBloc {
		knowledgeBaseText?: string;
	}

	const CONTACT_PROVIDER_MESSAGE =
		'was not able to access the knowledge base. Open an issue at https://github.com/constraintAutomaton/smt3-fusion-kb-pl-website/issues.';

	let { knowledgeBaseText = $bindable(undefined) }: IPropButtonBloc = $props();

	let demon_info_button_clicked: boolean = false;
	let rule_button_clicked: boolean = false;

	async function demon_knowledge_base_in_history_box(): Promise<void> {
		const res = await get_demon_knowledge_base();
		if (isResult(res)) {
			knowledgeBaseText = res.value;
		} else {
			console.error('error to report:', res.error);
			alert(CONTACT_PROVIDER_MESSAGE);
		}
		demon_info_button_clicked = !demon_info_button_clicked;
		if (!demon_info_button_clicked) {
			knowledgeBaseText = undefined;
		}
	}

	async function rule_knowledge_base_in_history_box(): Promise<void> {
		const res = await get_rule_knowledge_base();
		if (isResult(res)) {
			knowledgeBaseText = res.value;
		} else {
			console.error('error to report:', res.error);
			alert(CONTACT_PROVIDER_MESSAGE);
		}

		rule_button_clicked = !rule_button_clicked;
		if (!rule_button_clicked) {
			knowledgeBaseText = undefined;
		}
	}
</script>

<div>
	<button class="show-button" onclick={demon_knowledge_base_in_history_box}>Show Demon Info</button>
	<button onclick={rule_knowledge_base_in_history_box}>Show Rules</button>
</div>
