export default function* importParser() {
	const file = yield;
	// remove the semicolon
	yield;
	return {
		is: "statement",
		of: "import",
		file: file
	};
};
