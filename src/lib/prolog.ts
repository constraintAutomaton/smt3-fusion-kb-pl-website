import { init as initProlog, Prolog, Query, EVENT_READY, type Answer } from 'scryer';
import { type SafePromise, isResult, result } from 'result-interface';
import { get_demon_knowledge_base, get_rule_knowledge_base } from './knowledge_base';

let prolog_instantiated = false;
await initProlog();

let prolog = new Prolog();

export interface IKnowledgeBaseWorkerMessage {
	knowledge_base: string;
}

export interface IQueryWorkerMessage {
	query: string;
}

export function isQueryWorkerMessage(message: unknown): message is IQueryWorkerMessage {
	if (message === undefined || !(message instanceof Object)) {
		return false;
	}

	return 'query' in message;
}

export function isKnowledgeBaseWorkerMessage(
	message: unknown
): message is IKnowledgeBaseWorkerMessage {
	if (message === undefined || !(message instanceof Object)) {
		return false;
	}

	return 'knowledge_base' in message;
}

export async function queryProlog(query: string): SafePromise<WrapQueryIterator, Error> {
	if (!prolog_instantiated) {
		const [demon_knowledge_base, rule_knowledge_base] = await Promise.all([
			get_demon_knowledge_base(),
			get_rule_knowledge_base()
		]);

		if (isResult(demon_knowledge_base)) {
			prolog.consultText(demon_knowledge_base.value);
		} else {
			return {
				error: new Error('the demon knowledge base is not available')
			};
		}

		if (isResult(rule_knowledge_base)) {
			prolog.consultText(rule_knowledge_base.value);
		} else {
			return {
				error: new Error('the rule knowledge base is not available')
			};
		}
		prolog_instantiated = true;
	}

	if (!prolog.busy) {
		const raw_it = prolog.query(query);
		const it = new WrapQueryIterator(raw_it);
		return result(it);
	}
	return new Promise((resolve) => {
		prolog.addEventListener(EVENT_READY, async () => {
			const raw_it = prolog.query(query);
			const it = new WrapQueryIterator(raw_it);
			resolve(result(it));
		});
	});
}

export class WrapQueryIterator implements Iterable<Answer, boolean, void> {
	private readonly it: Query
	constructor(it: Query) {
		this.it = it;
	}

	public [Symbol.iterator](): Iterator<Answer, boolean, void> {
		return this;
	}

	public next(): IteratorResult<Answer, boolean> {
		try {
			return this.it.next()
		} catch {
			prolog = new Prolog();
			prolog_instantiated = false;
			return {
				done: true,
				value: false
			}
		}
	}
}
