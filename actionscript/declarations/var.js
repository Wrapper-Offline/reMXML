/**
 * takes in tokens and builds a var object out of them
 * @param {unknown[]} attributes 
 * @returns 
 */
export default function* varParser(attributes) {
	const name = yield;
	yield;
	const type = yield;
	const nextToken = yield;
	let init = [];
	if (nextToken == "=") {
		while (true) {
			const nextToken2 = yield;
			if (nextToken2 == ";") {
				break;
			}
			init.push(nextToken2);
		}
	}
	return {
		is: "declaration",
		of: "var",
		attributes: attributes,
		name: name,
		type: type,
		init: init
	};
};
