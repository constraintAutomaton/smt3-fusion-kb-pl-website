import { isKnowledgeBaseWorkerMessage, isQueryWorkerMessage } from './prolog';
import { init as initProlog, Prolog, Query } from 'scryer';

const PROLOG = new Prolog();

await initProlog();

onmessage = (e) => {
	console.log('Worker: Message received from main script');

	const message: unknown = e.data;

	if (isKnowledgeBaseWorkerMessage(message)) {
		PROLOG.consultText(message.knowledge_base);
		return;
	}

	if (isQueryWorkerMessage(message)) {
		const answer = PROLOG.query(message.query);
		postMessage(answer);
		return;
	}
};
