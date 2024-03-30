import codeBlock from "../code_block.js";

export default function* functionParser(attributes) {
	const nextToken = yield;
	let varified, name;
	if (nextToken == "get" || nextToken == "set") {
		varified = nextToken;
		name = yield;
	} else {
		name = nextToken;
	}
	const params = yield;

	const nextToken2 = yield;
	let returnType, bodyTokens;
	if (nextToken2 == ":") { // there is a return type, next is the body
		returnType = yield;
		bodyTokens = yield;
	} else { // no return type specified and we got the body instead, stick to *
		returnType = "*";
		bodyTokens = nextToken2;
	}
	// my body count's going waaay up
	const body = codeBlock(bodyTokens);

	return {
		is: "declaration",
		of: "function",
		name: name,
		varified: varified,
		attributes: attributes,
		params: params,
		returnType: returnType,
		body: body
	};
};
