import { init as initProlog, Prolog } from "scryer";
import { type Result, type SafePromise, isResult } from "result-interface";
import { get_demon_knowledge_base, get_rule_knowledge_base } from "./knowledge_base";

let prolog_instantiated = false;
const PROLOG = new Prolog();

export async function queryProlog(query: string): SafePromise<string, Error> {
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
        await initProlog();
    }

    const results = PROLOG.query(query);
    const result_list = [];
    for (const answer of results) {
        result_list.push(JSON.stringify(answer.bindings));
        //console.log(answer.bindings);
    }
    return {
        value: JSON.stringify(result_list)
    };
}