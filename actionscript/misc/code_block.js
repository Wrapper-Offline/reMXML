import TokenList from "../tokenList.js";
import paramAttributes from "./paramAttributes.js";
import expression from "./expression.js";

/**
 * @param {unknown[]} tokens 
 * @returns 
 */
export default function codeBlock(tokens) {
	let attributes = [];
	let partials = {};
	let newArray = [];

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
					const val = result.value;
					if (val.partial) {
						if (!partials[val.name]) {
							partials[val.name] = [val.partial, val];
						} else {
							partials[val.name][0] += val.partial;
							partials[val.name].push(val);
							// reached total number of pieces
							if (partials[val.name][0] == 3) {
								partials[val.name].shift();
								const newo = {};
								partials[val.name].forEach(v => Object.assign(newo, v));
								newArray.push(newo);
								break;
							}
						}
						delete val.partial;
						break;
					}
					newArray.push(result.value);
					break;
				}
			}
			return true;
		}
		return false;
	}

	let buildUp = [];
	while (tokens.length > 0) {
		const token = tokens.shift();
		if (TokenList.paramAttributes.includes(token)) {
			newArray.pop();
			const attr = paramAttributes(token, tokens.shift());
			attributes.push(attr);
			tokens.shift();
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
		if (token != ";") {
			buildUp.push(token);
			continue;
		} else {
			newArray.push(expression(buildUp));
			buildUp = [];
		}
		
	}
	return newArray;
};
