export default class Tokens {
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
	static symbolList = [" ", ".", ":", ";", "[", "]", "{", "}", "=", "(", ")", ","];
	static upLevelSymbols = ["{", "("];
	static downLevelSymbols = ["}", ")"];
};
