import codeBlock from "../code_block.js";

export default function* elseParser() {
	const nextToken = yield;
	let expression;
	if (nextToken == "if") {
		expression = yield;
	}
	const bodyTokens = yield;
	const body = codeBlock(bodyTokens);
	return {
		is: "statement",
		of: expression ? "else_if" : "else",
		expression: expression,
		body: body
	};
};
