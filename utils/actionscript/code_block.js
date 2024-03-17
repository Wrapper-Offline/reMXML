import TokenList from "../tokenList.js";

export default function codeBlock(tokens) {
	/**
	 * checks a list for a token.
	 * if it contains it, runs the parser function and
	 * inserts the result into the new array
	 * @param {Generator[]} list list of parser functions
	 * @param {*} token token to check in the list
	 * @returns {boolean} was the token in there and inserted
	 */
	function checkList(list, token) {
		if (Object.keys(list).includes(token)) {
			/** @type {Generator} */
			const defFunc = list[token]();
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

	let newArray = [];
	while (tokens.length > 0) {
		const token = tokens.shift();
		if (checkList(TokenList.decs, token)) continue;
		if (checkList(TokenList.sts, token)) continue;
		newArray.push(token);
	}
	return newArray;
};
