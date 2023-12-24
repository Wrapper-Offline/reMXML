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
		"const",
		"function",
		"get",
		"interface",
		"namespace",
		"set",
		"var",
	];
	/*  
		// tokens
		{
			"o": "of",
			"n": "name",
			"a": "argument",
			"b": "base",
			"p": "parameter"
		}
		// operators
		{
			"?": "optional",
			"[": "within array",
			"*": "any amount",
		}
	*/
	static defs = {
		"package": ["o", "n", "a"],
		"class": ["o", "n", "?b", "a"],
		"function": ["o", "n", "[*p", "t", "a"]
	};
	static base = ["extends", "implements"];
	static gyattdefs = [
		"class",
		"function",
		"interface",
		"package",
	];

	static openingTags = ["{", "("];
	static closingTags = ["}", ")"];
};
