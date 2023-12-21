export default class Tokens {
	/*
	OUTDATED
	KEEPING THIS HERE UNTIL I REFACTOR THE PARSER
	tapio/kuehiko x3
	static excludeFunctions = [
		"watcherSetupUtil",
		"moduleFactory",
		"initialize",
	];
	static excludeVars = [
		"_watcherSetupUtil",
		"__moduleFactoryInitialized",
		"_bindings",
		"_watchers",
		"_bindingsByDestination",
		"_bindingsBeginWithWord",
	];
	*/

	static symbolList = [" ", ".", ":", ";", "[", "]", "{", "}", "=", "(", ")", ",", "\"", "'"];
	static paramStatements = [
		"if",
		"for",
		"switch",
	];
	static attributes = [
		"dynamic",
		"final",
		"native",
		"interval",
		"override",
		"private",
		"protected",
		"public",
		"static",
	];
	static definitions = [
		"class",
		"const",
		"extends",
		"function",
		"get",
		"implements",
		"interface",
		"namespace",
		"package",
		"set",
		"var",
	];
	static gyattdefs = [
		"class",
		"function",
		"interface",
		"package",
	];

	static openingTags = ["{", "("];
	static closingTags = ["}", ")"];
};
