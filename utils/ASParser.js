import Tokens from "./tokens.js";

export default class ASParser {
	name = null;
	extends = null;
	namespaces = {
		// use the default flex namespaces
		fx: "http://ns.adobe.com/mxml/2009",
		s: "library://ns.adobe.com/flex/spark",
		mx: "library://ns.adobe.com/flex/mx"
	};
	/** @type {string[]} */
	imported = [];
	vars = {};
	functions = {};
	components = {};

	/**
	 * @param {string} input actionscript file
	 */
	constructor(input) {
		let tokens = [];
		const lines = input.split("\n");
		for (let lineIndex in lines) {
			const line = lines[lineIndex].trim();
			if (line.length == 0) {
				continue;
			}
			let prevIndex = 0;
			// split on certain symbols
			for (let charIndex = 0; charIndex < line.length; charIndex++) {
				const char = line[charIndex];
				if (Tokens.symbolList.find((v) => v == char) || charIndex == line.length - 1) {
					// don't cut off lines that don't end in ;
					if (charIndex == line.length - 1 && !line.endsWith(";")) {
						charIndex++;
					}
					// check to avoid inserting empty tokens
					if (prevIndex !== charIndex) {
						tokens.push(line.substring(prevIndex, charIndex));
					}
					// add operators to the token list
					if (char !== " " && charIndex !== line.length) {
						tokens.push(char);
					}
					prevIndex = charIndex + 1;
				}
			}
		}
		console.log(tokens);

		let tempComponents = {};
		let actions = [];
		let access = "", bindable = false, inComponentCreation = false;
		for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
			const token = tokens[tokenIndex];
			switch (token) {
				case "package": {
					actions.push({a:"packageDec"});
					continue;
				}
				case "import": {
					const namespace = tokens[tokenIndex + 1];
					actions.push({a:"import", import:[namespace]});
					continue;
				}
				case "public":
				case "protected":
				case "private": {
					access = token;
					continue;
				}
				case "Bindable": {
					bindable = true;
					continue;
				}
				case "class": {
					tokenIndex++;
					this.name = tokens[tokenIndex];
					actions.push({a:"classDec", name:this.name});
					continue;
				}
				case "extends": {
					if (actions[actions.length - 1].a == "classDec") {
						tokenIndex++;
						const arg = tokens[tokenIndex];
						let namespace = this.imported.find((v) => v.endsWith(arg));
						if (namespace.startsWith("spark")) {
							namespace = this.namespaces.s;
						} else if (namespace.startsWith("mx")) {
							namespace = this.namespaces.mx;
						}
						const component = {
							name: arg,
							from: namespace,
						};
						this.components["root"] = component;
					}
					continue;
				}
				case "watchers":
				case "bindings": { // we'll get there when we get there
					if (actions[actions.length - 1].a == "function") {
						actions.push({a:"ignoreLine"});
					}
					continue;
				}
				case "mx_internal":
				case "super": { // boooringg
					actions.push({a:"ignoreLine"});
					continue;
				}
				case "var": {
					actions.push({a:"varDec"});
					if (actions[actions.length - 2].a !== "function") {
						const name = tokens[tokenIndex + 1];
						if (Tokens.excludeVars.indexOf(name) > 0) {
							continue;
						}
						const type = tokens[tokenIndex + 3];
						let value;
						if (tokens[tokenIndex + 4] == "=") {
							value = tokens[tokenIndex + 5];
						} else {
							value = null;
						}
						this.vars[name] = {
							type,
							value,
							access
						};
					} else {
						if (inComponentCreation) {

						}
					}
					continue;
				}
				case "function": {
					const action = {a:"functionDec"};
					const func = {};
					let name = tokens[tokenIndex + 1];
					if (name == "get" || name == "set") {
						const prefix = name + ":";
						name = prefix + tokens[tokenIndex + 2];
					}
					action.name = name;
					// are we defining a component?
					if (new RegExp(`_${this.name}_(\w)+(\d)+_(i|c)`).test(name)) {
						return;
					}
					action.a = "functionDef";
					// todo: add support for bindable getters and setters
					//const setsBindableSetter = /^_(\d){9}/.test(name);
					if (bindable) {
						const varKey = Object.keys(this.vars).find((v) => v.endsWith(name));
						const variable = this.vars[varKey];
						
					}
					actions.push(action);
					this.functions[name] = func;
					
					continue;
				}
				case "=": {
					const setVar = actions[actions.length - 1];
					if (setVar.a == "varDef") {
						setVar.assign = token;
						setVar.startFromIndex = tokenIndex + 1;
					}
					continue;
				}
				case ":": {
					const action = actions[actions.length - 1];
					if (action.a == "functionDec") {
						const type = tokens[tokenIndex + 1];
						this.functions[action.name].type = type;
					}
					continue;
				}
				case ".": {
					const arg = tokens[tokenIndex + 1];
					if (arg == "mx_internal") { // useless to us; ignore
						actions.push({a:"ignoreLine"});
						break;
					}
					const latestAction = actions[actions.length - 1];
					switch (latestAction.a) {
						case "import": {
							latestAction.import.push(arg);
							break;
						}
						case "function": {
							const of = actions[actions.length - 1];
							if (of == "this") {
								this.vars[arg];
							}
							actions.push({a:"varDef", name:arg, of:of});
						}
					}
					continue;
				}
				case "{": {
					const last = actions[actions.length - 1];
					// TODO: if this keeps on going, refactor it
					switch (last.a) {
						case "packageDec":
							last.a = "package";
							break;
						case "classDec":
							last.a = "class";
							break;
						case "functionDec":
							last.a = "function";
							break;
					}
					continue;
				}
				case "}": {
					switch (actions[actions.length - 1].a) {
						case "varDef":
						case "ignoreLine":
							continue;
					}
					actions.pop();
					continue;
				}
				case ";": {
					const latestAction = actions[actions.length - 1];
					console.log(actions);
					console.log(tokens.slice(tokenIndex - 10, tokenIndex + 10));
					switch (latestAction.a) {
						case "import": {
							const importPath = latestAction.import.join(".");
							this.imported.push(importPath);
							break;
						}
						case "varDef": {
							const value = tokens.slice(latestAction.startFromIndex, tokenIndex).join();
							if (latestAction.of == "this") {
								this.args[setVar.name] = value;
							}
						}
					}
					actions.pop();
					continue;
				}
			}
		}


		/*let nsPieces = arg.split(".");
		nsPieces.pop();
		let alias = "";
		for (const folder of nsPieces) {
			alias += folder.at(0);
		}
		nsPieces.push("*");
		const namespace = nsPieces.join(".");
		this.namespaces[alias] = namespace;*/
	}
};
