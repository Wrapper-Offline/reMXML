import codeBlock from "../misc/code_block.js";

export default function* functionParser(attributes) {
	const varifyOrName = yield;
	let varified, name;
	if (varifyOrName == "get" || varifyOrName == "set") {
		varified = varifyOrName;
		name = yield;
	} else {
		name = varifyOrName;
	}
	const params = yield;

	const typeOrBody = yield;
	let returnType, bodyTokens;
	if (typeOrBody == ":") { // there is a return type and a body following it
		returnType = yield;
		bodyTokens = yield;
	} else { // no return type specified and we got the body instead, stick to *
		returnType = "*";
		bodyTokens = typeOrBody;
	}
	// my body count's going waaay up
	const body = codeBlock(bodyTokens);

	let returnx = {
		is: "declaration",
		of: "function",
		name: name,
		attributes: attributes,
		params: params,
		returnType: returnType,
		body: body
	};
	if (varified) {
		returnx.varified = varified;
	}
	return returnx;
};
