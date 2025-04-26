import { expect, describe, it, vi, beforeEach } from 'vitest';
import {
	get_demon_knowledge_base,
	get_rule_knowledge_base,
	LICENSE_KNOWLEDGE_BASE,
	resetKnowledgeBase
} from '../src/lib/knowledge_base';
import { IError, IResult } from 'result-interface';

const FETCH_SPY = vi.spyOn(globalThis, 'fetch');

describe(get_demon_knowledge_base.name, () => {
	beforeEach(() => {
		FETCH_SPY.mockClear();
		resetKnowledgeBase();
	});

	it('should fetch the demon knowledge base', async () => {
		FETCH_SPY.mockResolvedValueOnce(<any>{
			text: vi.fn().mockResolvedValueOnce('foo')
		});
		const kb = <IResult<string>>await get_demon_knowledge_base();
		expect(kb.value).toBe('foo');
	});

	it('should fetch the demon knowledge base and remove the license', async () => {
		FETCH_SPY.mockResolvedValueOnce(<any>{
			text: vi.fn().mockResolvedValueOnce(`${LICENSE_KNOWLEDGE_BASE}foo`)
		});
		const kb = <IResult<string>>await get_demon_knowledge_base();
		expect(kb.value).toBe('foo');
	});

	it('should return an error on failed fetch', async () => {
		FETCH_SPY.mockRejectedValueOnce(new Error('foo'));
		const kb = <IError<Error>>await get_demon_knowledge_base();
		expect(kb.error).toStrictEqual(new Error('foo'));
	});

	it('should not fetch the demon knowledge base if it was already fetched', async () => {
		FETCH_SPY.mockResolvedValueOnce(<any>{
			text: vi.fn().mockResolvedValueOnce('foo')
		});
		let kb = <IResult<string>>await get_demon_knowledge_base();
		expect(kb.value).toBe('foo');
		kb = <IResult<string>>await get_demon_knowledge_base();
		expect(kb.value).toBe('foo');
		expect(FETCH_SPY).toHaveBeenCalledOnce();
	});
});

describe(get_rule_knowledge_base.name, () => {
	beforeEach(() => {
		FETCH_SPY.mockClear();
		resetKnowledgeBase();
	});

	it('should fetch the rule knowledge base', async () => {
		FETCH_SPY.mockResolvedValueOnce(<any>{
			text: vi.fn().mockResolvedValueOnce('foo')
		});
		const kb = <IResult<string>>await get_rule_knowledge_base();
		expect(kb.value).toBe('foo');
	});

	it('should fetch the rule knowledge base and remove the license', async () => {
		FETCH_SPY.mockResolvedValueOnce(<any>{
			text: vi.fn().mockResolvedValueOnce(`${LICENSE_KNOWLEDGE_BASE}foo`)
		});
		const kb = <IResult<string>>await get_rule_knowledge_base();
		expect(kb.value).toBe('foo');
	});

	it('should return an error on failed fetch', async () => {
		FETCH_SPY.mockRejectedValueOnce(new Error('foo'));
		const kb = <IError<Error>>await get_rule_knowledge_base();
		expect(kb.error).toStrictEqual(new Error('foo'));
	});

	it('should not fetch the rule knowledge base if it was already fetched', async () => {
		FETCH_SPY.mockResolvedValueOnce(<any>{
			text: vi.fn().mockResolvedValueOnce('foo')
		});
		let kb = <IResult<string>>await get_rule_knowledge_base();
		expect(kb.value).toBe('foo');
		kb = <IResult<string>>await get_rule_knowledge_base();
		expect(kb.value).toBe('foo');
		expect(FETCH_SPY).toHaveBeenCalledOnce();
	});
});
