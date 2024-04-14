import packageParser from "./declarations/package.js";
import classParser from "./declarations/class.js";
import importParser from "./statements/import.js";
import functionParser from "./declarations/function.js";
import varParser from "./declarations/var.js";
import ifParser from "./statements/if.js";
import elseParser from "./statements/else.js";
import returnParser from "./statements/return.js";
import doWhileParser from "./statements/do_while.js";
import whileParser from "./statements/while.js";

export default class TokenList {
	static symbolList = [" ", ".", ":", ";", "[", "]", "{", "}", "=", "(", ")", ",", "\"", "'"];
	static openingTags = ["{", "(", "["];
	static closingTags = ["}", ")", "]"];

	static blockedVars = [
		"_watcherSetupUtil",
		"__moduleFactoryInitialized",
		"_bindings",
		"_watchers",
		"_bindingsByDestination",
		"_bindingsBeginWithWord",
		"this.mx_internal::_bindings",
		"this.mx_internal::_watchers",
		"this.mx_internal::_bindingsByDestination",
		"this.mx_internal::_bindingsBeginWithWord"
	];

	static operators = {
		"=": "assign",
		"+": "add",
		"+=": "add_assign",
		"-": "subtract",
		"-=": "subtract_assign",
		"*": "multiply",
		"*=": "multiply_assign",
		"/": "divide",
		"/=": "divide_assign",
		"%": "mod",
		"%=": "mod_assign",
		"==": "equal",
		"===": "equal_strict"
	};
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
	static paramAttributes = [
		"Bindable",
		"Embed",
	];
	static componentNameMatch = new RegExp("^_([a-zA-Z]+)_([a-zA-Z]+)(\\d+)_(c|i)$");

	static decs = {
		"package": packageParser,
		"class": classParser,
		"function": functionParser,
		"var": varParser,
	};
	static sts = {
		"import": importParser,
		"if": ifParser,
		"else": elseParser,
		"while": whileParser,
		"do": doWhileParser,
		"return": returnParser,
	};
};
