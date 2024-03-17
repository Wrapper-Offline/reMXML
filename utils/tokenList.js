import packageParser from "./actionscript/declarations/package.js";
import classParser from "./actionscript/declarations/class.js";
import importParser from "./actionscript/statements/import.js";

export default class TokenList {
	/*
	OUTDATED
	KEEPING THIS HERE UNTIL I REFACTOR THE PARSER
	tapio/kuehiko brainrot
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
			"of": "definition of",
			"n": "name",
			"a": "argument",
			"b": "base",
			"p": "parameter",
			"t": "type"
		}
		// operators
		{
			"?": "optional",
			"[": "within array",
			"*": "any amount",
		}
	*/
	static decs = {
		"package": packageParser,
		"class": classParser
	};
	static sts = {
		"import": importParser
	};

	static defs = {
		"function": ["of", "name", "[*p", "t", "a"]
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
