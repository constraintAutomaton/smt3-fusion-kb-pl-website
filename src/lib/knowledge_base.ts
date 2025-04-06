import { init, Prolog } from "scryer";
import { type Result, type SafePromise, createSafePromise, isError } from "result-interface";


let demon_knowledge_base: string | undefined;
let rule_knowledge_base: string | undefined;

const LICENSE_KNOWLEDGE_BASE = `% smt-nocturne-prolog-kb-generator: A generates of a Prolog knowledge base
% to describe demons, their fusion, and fusion mechanics for the game 
% Shin Megami Tensei III: Nocturne.
% Copyright (C) 2025  Bryan-Elliott Tam
%
% This program is free software; you can redistribute it and/or modify
% it under the terms of the GNU General Public License as published by
% the Free Software Foundation; either version 2 of the License, or
% (at your option) any later version.
%
% This program is distributed in the hope that it will be useful,
% but WITHOUT ANY WARRANTY; without even the implied warranty of
% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
% GNU General Public License for more details.
%
% You should have received a copy of the GNU General Public License along
% with this program; if not, write to the Free Software Foundation, Inc.,
% 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

`;

export async function get_demon_knowledge_base(): SafePromise<string, Error> {
    if (demon_knowledge_base !== undefined) {
        return { value: demon_knowledge_base };
    }
    const res = await createSafePromise(fetch("./demon.pl"));
    if (isError(res)) {
        // fetch on rejection should return an error
        return {
            error: <Error>res.error
        }
    }

    demon_knowledge_base = (await res.value.text()).replace(LICENSE_KNOWLEDGE_BASE, "");
    return { value: demon_knowledge_base };
}

export async function get_rule_knowledge_base(): SafePromise<string, Error> {
    if (rule_knowledge_base !== undefined) {
        return { value: rule_knowledge_base };
    }
    const res = await createSafePromise(fetch("./planner.pl"));
    if (isError(res)) {
        // fetch on rejection should return an error
        return {
            error: <Error>res.error
        }
    }
    rule_knowledge_base = (await res.value.text()).replace(LICENSE_KNOWLEDGE_BASE, "");
    return { value: rule_knowledge_base };
}


