import { init as initProlog, Prolog, Query } from "scryer";
import { type Result, type SafePromise, isResult } from "result-interface";
import { get_demon_knowledge_base, get_rule_knowledge_base } from "./knowledge_base";

let prolog_instantiated = false;
await initProlog();

const PROLOG = new Prolog();

export interface IKnowledgeBaseWorkerMessage {
    knowledge_base: string
}

export interface IQueryWorkerMessage {
    query: string
}

export function isQueryWorkerMessage(message: unknown): message is IQueryWorkerMessage {
    if (message === undefined || !(message instanceof Object)) {
        return false;
    }

    return "query" in message;
}

export function isKnowledgeBaseWorkerMessage(message: unknown): message is IKnowledgeBaseWorkerMessage {
    if (message === undefined || !(message instanceof Object)) {
        return false;
    }

    return "knowledge_base" in message;
}

export async function queryProlog(query: string): SafePromise<Query, Error> {
    if (!prolog_instantiated) {
        const [demon_knowledge_base, rule_knowledge_base] = await Promise.all([
            get_demon_knowledge_base(),
            get_rule_knowledge_base()
        ]);

        if (isResult(demon_knowledge_base)) {
            PROLOG.consultText(demon_knowledge_base.value);
        } else {
            return {
                error: new Error("the demon knowledge base is not available")
            };
        }

        if (isResult(rule_knowledge_base)) {
            PROLOG.consultText(rule_knowledge_base.value);
        } else {
            return {
                error: new Error("the rule knowledge base is not available")
            };
        }
        prolog_instantiated = true;
    }

    const results = PROLOG.query(query);

    return {
        value: results
    };
}
