export default class Tokens {
	static excludeFunctions = [""];
	static excludeVars = [
		"_watcherSetupUtil",
		"__moduleFactoryInitialized",
		"_bindings",
		"_watchers",
		"_bindingsByDestination",
		"_bindingsBeginWithWord",
	];

	static symbolList = [" ", ":", ";", "[", "]", "{", "}", "="];

	/**
	 * @param {string} keyword 
	 * @returns {does:string, hasArg:boolean}
	 */
	static getKeyword(keyword) {
		switch (keyword) {
			case "import":
				return {does:"import", hasArg:true};
			case "var":
				return {does:"property", hasArg:true};
			case "public":
				return {does:"changeAccess"};
			case "class":
				return {does:"class", hasArg:true};
			case "extends":
				return {does:"classExtends", hasArg:true};
			case "func":
				return {does:"beginFuncDefinition", hasArg:true};
			case ":":
				return {does:"funcReturnType", hasArg:true};
		}
		if (keyword.endsWith(".mxmlContent")) {
			return {does:"setChildren", hasArg:true, argOffset:1};
		}
		return false;
	}
};
