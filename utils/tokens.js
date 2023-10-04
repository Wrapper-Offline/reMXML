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
	static symbolList = [" ", ".", ":", ";", "[", "]", "{", "}", "=", "(", ")", ","];
};
