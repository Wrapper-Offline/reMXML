import codeBlock from "../misc/code_block.js";

export default function* whileParser() {
	const expression = yield;
	const bodyTokens = yield;
	const body = codeBlock(bodyTokens);
	return {
		is: "statement",
		of: "while",
		expression: expression,
		body: body
	};
};
