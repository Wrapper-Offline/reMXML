import codeBlock from "../misc/code_block.js";

export default function* doWhileParser() {
	const bodyTokens = yield;
	const body = codeBlock(bodyTokens);
	yield;
	const expression = yield;
	yield;
	return {
		is: "statement",
		of: "do_while",
		expression: expression,
		body: body
	};
};
