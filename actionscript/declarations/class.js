import codeBlock from "../misc/code_block.js";

export default function* classParser() {
	const name = yield;
	let bases = [], body;
	while (true) {
		const nextToken = yield;
		if (nextToken == "extends" || nextToken == "implements") {
			bases.push({type: nextToken, is: yield});
		} else {
			body = codeBlock(nextToken);
			break;
		}
	}
	return {
		is: "declaration",
		of: "class",
		name: name,
		base: bases,
		body: body
	};
};
