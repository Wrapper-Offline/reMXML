import codeBlock from "../code_block.js";

export default function* classParser() {
	const name = yield;
	const nextToken = yield;
	let baseMethod, base, body;
	if (nextToken == "extends" || nextToken == "implements") {
		baseMethod = nextToken;
		base = yield;
		const bodyTokens = yield;
		body = codeBlock(bodyTokens);
	} else {
		body = codeBlock(nextToken);
	}
	return {
		is: "declaration",
		of: "class",
		name: name,
		base: base ? {type: baseMethod, is: base} : undefined,
		body: body
	};
};
