import TokenList from "../tokenList.js";
import paramAttributes from "./paramAttributes.js";

/**
 * @param {unknown[]} tokens 
 * @returns 
 */
export default function expression(tokens) {
	if (!Array.isArray(tokens)) {
		tokens = [tokens];
	}
	let arg1Arr = [],
		operation = null,
		arg2Arr = [];
	let newArray = [],
		oppFound = false;
	while (tokens.length > 0) {
		const token = tokens.shift();
		if (Object.keys(TokenList.operators).includes(token)) {
			oppFound = true;
			operation = TokenList.operators[token];
			continue;
		} else if (!oppFound) {
			arg1Arr.push(token)
		} else {
			arg2Arr.push(token);
		}
	};
	if (oppFound) {
		const arg1 = expression(arg1Arr);
		const arg2 = expression(arg2Arr);
		return {
			is: "operation",
			of: "assignment",
			arg1: arg1,
			arg2: arg2
		};
	}
	return arg1Arr;
};
