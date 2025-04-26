<script lang="ts">
	import Buttonbloc from './Buttonbloc.svelte';
	import InputBloc from './InputBloc.svelte';

	let knowledgeBaseText: string | undefined = $state();
	let history: string[] = $state([]);

	let logText: string = $derived(knowledgeBaseText ?? history.join('\n'));
</script>

<div class="command-box">
	<textarea class="log-box" readonly>{logText}</textarea>
	<InputBloc bind:history />
</div>

<Buttonbloc bind:knowledgeBaseText />

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
</style>
