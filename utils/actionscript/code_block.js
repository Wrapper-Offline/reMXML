import TokenList from "../tokenList.js";
import paramAttributes from "./paramAttributes.js";

/**
 * @param {unknown[]} tokens 
 * @returns 
 */
export default function codeBlock(tokens) {
	/**
	 * checks a list for a token.
	 * if it contains it, runs the parser function and
	 * inserts the result into the new array
	 * @param {Generator[]} list list of parser functions
	 * @param {*} token token to check in the list
	 * @param {any[]} additionalArgs additional arguments to be passed
	 * @returns {boolean} was the token in there and inserted
	 */
	function checkList(list, token, ...additionalArgs) {
		if (Object.keys(list).includes(token)) {
			/** @type {Generator} */
			const defFunc = list[token](...additionalArgs);
			defFunc.next();
			while (true) {
				const token = tokens.shift();
				const result = defFunc.next(token);
				if (result.done) {
					newArray.push(result.value);
					break;
				}
			}
			return true;
		}
		return false;
	}

	let attributes = [];
	let newArray = [];
	while (tokens.length > 0) {
		const token = tokens.shift();
		if (token == "[") {
			const nextToken = tokens.shift();
			if (TokenList.paramAttributes.includes(nextToken)) {
				const attr = paramAttributes(nextToken, tokens.shift());
				attributes.push(attr);
				tokens.shift();
			} else {
				newArray.push(token, nextToken);
			}
			continue;
		}
		if (TokenList.attributes.includes(token)) {
			attributes.push(token);
			continue;
		}
		if (checkList(TokenList.decs, token, attributes)) {
			attributes = [];
			continue;
		}
		if (checkList(TokenList.sts, token)) continue;
		newArray.push(token);
	}
	return newArray;
};
