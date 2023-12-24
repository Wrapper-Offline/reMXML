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
	tokens = [];

	/**
	 * @param {string} input actionscript file
	 */
	constructor(input) {
		this.#extractTokens(input).then(() => {
			//this.#parsethesecondcoming();
		}).catch((err) => console.error("errm.. that's not supposed to happen!\n", err));
	}

	#extractTokens(input) {
		return new Promise((res, rej) => {
			let tokens = [];
			const lines = input.split("\n");
			for (let lineIndex in lines) {
				const line = lines[lineIndex].trim();
				if (line.length == 0 || line.startsWith("//")) {
					continue;
				}
				let prevIndex = 0;
				// split on certain symbols
				for (let charIndex = 0; charIndex < line.length; charIndex++) {
					const char = line[charIndex];
					if (Tokens.symbolList.find((v) => v == char) || charIndex == line.length - 1) {
						// don't cut off lines that don't end in ;
						if (
							charIndex == line.length - 1 &&
							!Tokens.symbolList.find((v) => v == line.at(-1))
						) {
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
			// organize it all
			let level = [];
			let inString = false, inComment = false, joinNext = false;
			//let aHardCodedBreakCauseWhyNot_ItsHere_YouNeverKnowWhenYouNeedIt = 0;
			for (let tokenIndex = 0; ; tokenIndex++) {
				tokenIndex = Number.parseInt(tokenIndex);

				let currLevel = tokens;
				for (const levelIndex of level) {
					currLevel = currLevel[levelIndex];
				}
				let token = currLevel[tokenIndex];

				if (!inComment && !inString && !joinNext) {
					if (Tokens.openingTags.includes(token)) {
						// remove the opening tag
						currLevel.splice(tokenIndex, 1);
						// remove everything following this and put it in a new array
						const split = currLevel.splice(tokenIndex, currLevel.length - tokenIndex);
						currLevel.push(split);
						// take note of where we should be and reset the token index
						level.push(tokenIndex);
						tokenIndex = -1;
					} else if (Tokens.closingTags.includes(token)) {
						const split = currLevel.splice(tokenIndex, currLevel.length - tokenIndex);
						// remove the closing tag
						split.splice(0, 1);
						// locate the previous level so we can move everything back to it
						let prevLevel = tokens;
						let levelIndex = 0;
						for (let levelNumber = 0; levelNumber < level.length - 1; levelNumber++) {
							levelIndex = level[levelNumber];
							prevLevel = prevLevel[levelIndex];
						}
						prevLevel.push(...split);
						// now we can leave this and never come back we're done here no more nuh uh hell no no way
						// bye bye! :D
						tokenIndex = level[level.length - 1];
						level.splice(level.length - 1, 1)
						if (level.length == 0) { 
							break;
						}
					}
				} else if (inComment) {
					currLevel.splice(tokenIndex, 1);
					tokenIndex--;
				} else if (inString) {
					if (
						currLevel[tokenIndex - 1] !== "\"" &&
						token !== "\""
					) {
						token = " " + token;
					}
					currLevel[tokenIndex - 1] += token;
					currLevel.splice(tokenIndex, 1);
					tokenIndex--;
				} else if (joinNext) {
					currLevel[tokenIndex - 2] += "." + token;
					currLevel.splice(tokenIndex - 1, 2);
					tokenIndex -= 2;
					joinNext = false;
				}
				switch (token) {
					case "'":
					case "\"":
						inString = !inString;
						break;
					case "/*":
						if (inString) break;
						inComment = true;
						currLevel.splice(tokenIndex, 1);
						tokenIndex--;
						break;
					case "*/":
						if (inString) break;
						inComment = false;
						break;
					case ".":
						if (inString) break;
						joinNext = true;
						break;
				}
				/*
				leaving this in case it ever FUCKS UP
				console.log(currLevel, token, tokenIndex, level.length, level, "kneevil");
				aHardCodedBreakCauseWhyNot_ItsHere_YouNeverKnowWhenYouNeedIt++;
				if(aHardCodedBreakCauseWhyNot_ItsHere_YouNeverKnowWhenYouNeedIt == 46) {
					break;
				}
				*/
			}
			let newArray = [];
			let stored = {a:[]};
			let inDef = false, gyattdef = false;
			let defObject = {};
			let wevetaken = 0;

			let currentAction = {};
			// finally we'll turn everything into like a tree and we're done with this stage
			for (let tokenIndex = 0; ; tokenIndex++) {
				tokenIndex = Number.parseInt(tokenIndex);

				let currLevel = tokens;
				for (const levelIndex of level) {
					currLevel = currLevel[levelIndex];
				}
				let token = currLevel[tokenIndex];

				if (Array.isArray(token)) {
					if (gyattdef) {
						currLevel.body = token;
						defObject = {};
					} else {
						level.push(tokenIndex);
						tokenIndex = -1;
						continue;
					}
				} else if (typeof token == "undefined") {
					if (level.length > 0) {
						tokenIndex = level.pop();
						continue;
					}
					break;
				}

				if (token == ";") {
					if (inDef) {
						currLevel[tokenIndex] = defObject;
						defObject = {};
					}
				}

				if (Tokens.attributes.includes(token)) {
					stored.a.push(token);
					currLevel.splice(tokenIndex, 1);
					tokenIndex--;
				}
				if (Tokens.definitions.includes(token)) {
					if (!inDef) {
						inDef = true;
						if (Tokens.gyattdefs.includes(token)) {
							gyattdef = true;
						}
						defObject = {
							name: currLevel[tokenIndex + 1],
							def: token
						};
						if (stored.a.length > 0) {
							defObject.attributes = stored.a;
							stored.a = [];
						}
					} else {
						defObject[token] = currLevel[tokenIndex + 1];
					}
				}

				console.log(token)
			}
			console.dir(tokens, {depth:null});
			this.tokens = tokens;
			res();
		});
	}

	#parsethesecondcoming() {
		for (let tokenIndex = 0; ; tokenIndex++) {
			tokenIndex = Number.parseInt(tokenIndex);

			let currLevel = tokens;
			for (const levelIndex of level) {
				currLevel = currLevel[levelIndex];
			}
			let token = currLevel[tokenIndex];

			if (Array.isArray(token)) {
				if (gyattdef) {
					currLevel.body = token;
					defObject = {};
				} else {
					level.push(tokenIndex);
					tokenIndex = -1;
					continue;
				}
			} else if (typeof token == "undefined") {
				if (level.length > 0) {
					tokenIndex = level.pop();
					continue;
				}
				break;
			}

			if (Tokens.attributes.includes(token)) {
				
			}
			if (Tokens.definitions.includes(token)) {
				
			}
		}
	}

	#parseTokens() {
		// yeah i think this entire function is getting scrapped lol
		// this is just not working well
		// like at all
		let tokenIndex = 0;
		try {
			let tempComponents = {};
			let actions = [];
			let access = "", bindable = false, inComponentCreation = false;
			for (; tokenIndex < this.tokens.length; tokenIndex++) {
				const token = this.tokens[tokenIndex];
				switch (token) {
					case "package": {
						actions.push({a:"packageDec"});
						console.log("Package defined.");
						continue;
					}
					case "import": {
						const namespace = this.tokens[tokenIndex + 1];
						actions.push({a:"import", import:[namespace]});
						console.log(`Beginning import from ${namespace}.`);
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
						this.name = this.tokens[tokenIndex];
						actions.push({a:"classDec", name:this.name});
						console.log("Entered class definition.");
						continue;
					}
					case "extends": {
						if (actions[actions.length - 1].a == "classDec") {
							tokenIndex++;
							const arg = this.tokens[tokenIndex];
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
						if (actions[actions.length - 1].a == "functionBody") {
							actions.push({a:"ignoreLine"});
						}
						continue;
					}
					case "super": { // boooringg
						actions.push({a:"ignoreLine"});
						continue;
					}
					case "var": {
						actions.push({a:"var", returnsArray:[]});
						const prevAction = actions[actions.length - 2].a;
						switch (prevAction.a) {
							case "functionBody": {
								const name = this.tokens[tokenIndex + 1];
								prevAction.varNames.push(name);
								if (inComponentCreation) {
	
								}
							}
							case "class": {
								const name = this.tokens[tokenIndex + 1];
								if (Tokens.excludeVars.indexOf(name) > -1) {
									continue;
								}
								const type = this.tokens[tokenIndex + 3];
								let value;
								if (this.tokens[tokenIndex + 4] == "=") {
									value = this.tokens[tokenIndex + 5];
								} else {
									value = null;
								}
								this.vars[name] = {
									type,
									value,
									access
								};
							}
						}
						continue;
					}
					case "function": {
						let name = this.tokens[tokenIndex + 1];

						// are we defining a component?
						if (new RegExp(`_${this.name}_(\w)+(\d)+_(i|c)`).test(name)) {
							const action = {a:"componentDef",returnsArray:[]};
							const func = {};
							return;
						} else {
							if (name == "get" || name == "set") {
								name = prefix + this.tokens[tokenIndex + 2];
							}
							// fuck off
							if (Tokens.excludeFunctions.indexOf(name) > -1) {
								continue;
							}

							const action = {a:"functionDef",returnsArray:[]};
							const func = {};
							func.b = name;
							/* todo: add support for bindable getters and setters
							//const setsBindableSetter = /^_(\d){9}/.test(name);
							if (bindable) {
								// check for a component with this name
								const varKey = Object.keys(this.vars).find((v) => v.endsWith(name));
								const variable = this.vars[varKey];
								
							}*/
							action.name = name;
						}
						
					
						
						actions.push(action);
						this.functions[name] = func;
						
						continue;
					}
					case "=": {
						const latestAction = actions[actions.length - 1];
						if (this.tokens[tokenIndex + 1] == "==") {
							tokenIndex++;
						} else {
							switch (latestAction.a) {
								case "property":
									latestAction.a = "setProperty";
									break;
								case "var":
									latestAction.returns = latestAction.returnsArray.join(".");
									delete latestAction.returnsArray;
									latestAction.a = "setVar";
									break;
								case "functionBody": {
									latestAction.a = "ignoreLine";
								}
								default:
									continue;
							}
							latestAction.operation = token;
							latestAction.startFromIndex = tokenIndex + 1;
						}
						continue;
					}
					case ":": {
						const action = actions[actions.length - 1];
						if (this.tokens[tokenIndex + 1] == ":") {
							if (this.tokens[tokenIndex - 1] == "mx_internal") {
								actions.push({a:"ignoreLine"});
								continue;
							}
							tokenIndex++;
						} else {
							switch (action.a) {
								case "var": {
									const type = this.tokens[tokenIndex + 1];
									action.returnsArray.push(type);
									break;
								}
								case "functionDef": {
									const type = this.tokens[tokenIndex + 1];
									this.functions[action.name].returnsArray.push(type);
								}
							}
						}
						continue;
					}
					case ".": {
						const arg = this.tokens[tokenIndex + 1];
						const latestAction = actions[actions.length - 1];
						switch (latestAction.a) {
							case "import": {
								latestAction.import.push(arg);
								break;
							}
							case "var":
							case "functionDef": {
								latestAction.returnsArray.push(arg);
								break;
							}
							case "functionBody": {
								if (latestAction.name == this.name && arg == "mx_internal") {
									actions.push({a:"ignoreLine"});
									break;
								}
								const of = actions[actions.length - 1];
								actions.push({a:"property", name:arg, of:of});
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
							case "functionDef":
								last.returnsType = last.returnsArray.join(".");
								delete last.returnsArray;
								last.a = "functionBody";
								break;
						}
						continue;
					}
					case "}": {
						switch (actions[actions.length - 1].a) {
							case "setVar":
							case "setProperty":
							case "ignoreLine":
								console.log("osdkfodps")
								continue;
						}
						actions.pop();
						continue;
					}
					case ";": {
						const latestAction = actions[actions.length - 1];
						switch (latestAction.a) {
							case "import": {
								const importPath = latestAction.import.join(".");
								this.imported.push(importPath);
								console.log("Import completed. Actions in progress:", actions);
								break;
							}
							case "var": {
								latestAction.returns = latestAction.returnsArray.join(".");
								delete latestAction.returnsArray;
								break;
							}
							case "setProperty": {
								if (latestAction.b == "set" && actions[actions.length - 2].name == this.name) {
									const value = this.tokens.slice(latestAction.startFromIndex, tokenIndex).join();
									if (latestAction.of == "this") {
										this.args[setVar.name] = value;
									}
								}
							}
						}
						actions.pop();
						continue;
					}
				}
			}
		} catch (e) {
			
		}
	}
};
