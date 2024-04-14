import expression from "../misc/expression.js";

export default function* returnParser() {
	const fuckmygyatt = yield;
	let value;
	if (fuckmygyatt !== ";") {
		value = expression(fuckmygyatt);
		yield; // don't care // not one bit
	}
	return {
		is: "statement",
		of: "return",
		value: value
	};
};
