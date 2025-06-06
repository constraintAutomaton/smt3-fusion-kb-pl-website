import { expect, describe, it, vi, type Mock, beforeEach, assert } from 'vitest';
import { queryProlog, WrapQueryIterator } from '../src/lib/prolog';
import * as kb from '../src/lib/knowledge_base';
import { IResult, isResult, Result } from 'result-interface';
import { Query, Atom } from 'scryer';

vi.mock('../src/lib/knowledge_base', async () => {
	// Import the actual module to preserve non-mocked functions
	const actual = await vi.importActual<typeof import('../src/lib/knowledge_base')>(
		'../src/lib/knowledge_base'
	);

	return {
		...actual,
		get_demon_knowledge_base: vi.fn(),
		get_rule_knowledge_base: vi.fn()
	};
});

describe(queryProlog.name, () => {
	const A_QUERY = 'bar(X).';
	const MOCK_GET_DEMON = kb.get_demon_knowledge_base as Mock;
	const MOCK_GET_RULE = kb.get_rule_knowledge_base as Mock;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return an error given the demon knowledge base cannot be fetch', async () => {
		MOCK_GET_DEMON.mockResolvedValueOnce({
			error: ''
		});

		expect(await queryProlog(A_QUERY)).toStrictEqual({
			error: new Error('the demon knowledge base is not available')
		});
	});

	it('should return an error given the rule knowledge base cannot be fetch', async () => {
		MOCK_GET_DEMON.mockResolvedValueOnce({
			value: 'foo(a). foo(b).'
		});

		MOCK_GET_RULE.mockResolvedValueOnce({ error: '' });

		expect(await queryProlog(A_QUERY)).toStrictEqual({
			error: new Error('the rule knowledge base is not available')
		});
	});

	it('should return the query result', async () => {
		MOCK_GET_DEMON.mockResolvedValueOnce({
			value: 'foo(a). foo(b).'
		});

		MOCK_GET_RULE.mockResolvedValueOnce({ value: 'bar(X) :- foo(X) .' });
		const result: Result<WrapQueryIterator> = await queryProlog(A_QUERY);

		expect(isResult(result)).toBe(true);

		const query = (<IResult<WrapQueryIterator>>result).value;
		const expectedResult = [
			{
				bindings: {
					X: new Atom('a')
				}
			},
			{
				bindings: {
					X: new Atom('b')
				}
			}
		];
		let i = 0;
		for (const answer of query) {
			expect(answer).toStrictEqual(expectedResult[i]);
			i += 1;
		}
	});

	it('should return recover after a failed query', async () => {
		MOCK_GET_DEMON.mockResolvedValue({
			value: 'foo(a). foo(b).'
		});

		MOCK_GET_RULE.mockResolvedValue({ value: 'bar(X) :- foo(X) .' });
		const result: Result<WrapQueryIterator> = await queryProlog("boo(X).");
		expect(isResult(result)).toBe(true);

		let i = 0;

		for (const _ of (<IResult<WrapQueryIterator>>result).value){
			i+=1
		}
		expect(i).toBe(0)


		const new_result: Result<WrapQueryIterator> = await queryProlog(A_QUERY);
		expect(isResult(result)).toBe(true);

		const query = (<IResult<WrapQueryIterator>>new_result).value;
		const expectedResult = [
			{
				bindings: {
					X: new Atom('a')
				}
			},
			{
				bindings: {
					X: new Atom('b')
				}
			}
		];
		i = 0;
		for (const answer of query) {
			expect(answer).toStrictEqual(expectedResult[i]);
			i += 1;
		}
	});

});
