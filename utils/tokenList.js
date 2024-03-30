import packageParser from "./actionscript/declarations/package.js";
import classParser from "./actionscript/declarations/class.js";
import importParser from "./actionscript/statements/import.js";
import functionParser from "./actionscript/declarations/function.js";
import varParser from "./actionscript/declarations/var.js";
import ifParser from "./actionscript/statements/if.js";
import elseParser from "./actionscript/statements/else.js";
import returnParser from "./actionscript/statements/return.js";

export default class TokenList {
	static symbolList = [" ", ".", ":", ";", "[", "]", "{", "}", "=", "(", ")", ",", "\"", "'"];
	static openingTags = ["{", "("];
	static closingTags = ["}", ")"];

	static blockedVars = [
		"_watcherSetupUtil",
		"__moduleFactoryInitialized",
		"_bindings",
		"_watchers",
		"_bindingsByDestination",
		"_bindingsBeginWithWord",
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
		"return": returnParser,
	};
};
