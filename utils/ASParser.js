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
	functions = [];
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

		let currentState = {
			state: "package"
		};
		let access = "", functionScoped = false, bindable = false, inComponentCreation = false;
		for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
			const token = tokens[tokenIndex];
			switch (token) {
				case "import": {
					tokenIndex++;
					this.imported.push(tokens[tokenIndex]);
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
					continue;
				}
				case "extends": {
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
					continue;
				}
				case "var": {
					if (functionScoped == false) {
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
					currentState = "funcDef";
					functionScoped = true;
					let name = tokens[tokenIndex + 1];
					if (name == "get" || name == "set") {
						name = tokens[tokenIndex + 2];
					}
					if (new RegExp(`_${this.name}_(\w)+(\d)+_(i|c)`).test(name)) {
						
					}
					const setsBindableSetter = /^_(\d){9}/.test(name);
					if (bindable) {
						const varKey = Object.keys(this.vars).find((v) => v.endsWith(name));
						const variable = this.vars[varKey];
						
					}
					/*let namespace = this.imported.find((v) => v.endsWith(arg));
					if (namespace.startsWith("spark")) {
						namespace = this.namespaces.s;
					}
					const component = {
						name: arg,
						from: namespace,
					};
					this.components.root = component;*/
				}
				case "{": {
					if (currentState == "funcDef") {
						currentState = "inFunc";
					}
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
