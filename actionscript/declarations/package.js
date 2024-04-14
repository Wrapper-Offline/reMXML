import codeBlock from "../misc/code_block.js";

export default function* packageParser() {
	const name = yield;
	const bodyTokens = yield;
	const body = codeBlock(bodyTokens);
	return {
		is: "declaration",
		of: "package",
		name: name,
		body: body
	};
};
