export default function* returnParser() {
	const expression = yield;
	yield;
	return {
		is: "statement",
		of: "return",
		expression: expression
	};
};

