import codeBlock from "../code_block.js";

export default function* ifParser() {
	const expression = yield;
	const bodyTokens = yield;
	const body = codeBlock(bodyTokens);
	return {
		is: "statement",
		of: "if",
		expression: expression,
		body: body
	};
};
