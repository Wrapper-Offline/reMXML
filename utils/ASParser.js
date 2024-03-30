import Tokens from "./tokenList.js";
import packageParser from "./actionscript/declarations/package.js";
import TokenList from "./tokenList.js";

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
		this.#extractTokens(input).then(() => {
			this.#scrapeData();
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
			// finally some cleanup
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
						// take note of the new array index and reset the current index
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
						// now we can go back up
						tokenIndex = level[level.length - 1];
						level.splice(level.length - 1, 1);
						// we finished the file
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

			const packageFunc = packageParser();
			packageFunc.next();
			packageFunc.next(tokens[1]);
			const asPackage = packageFunc.next(tokens[2]).value;
			
			console.dir(asPackage, {depth:null});
			this.package = asPackage;
			res();
		});
	}

	#scrapeData() {
		const daclass = this.package.body.find((t) => 
			t.is == "declaration" && t.of == "class");
		this.name = daclass.name;
		let isComp = false;
		daclass.body
			.filter((t) => t.is == "declaration" && t.of == "var")
			.forEach((t) => {
				if (TokenList.blockedVars.includes(t.name)) {
					isComp = true;
					return;
				}
				this.vars[t.name] = t;
				delete this.vars[t.name].name;
			});
			console.log(this.vars)
		if (!isComp) {
			throw "not an mxml component"
		}
		daclass.body
			.filter((t) => t.is == "declaration" && t.of == "function")
			.forEach((t) => {
				if (t.name == this.name) { // comp class constructor
					console.log(t)
				}
				const matches = t.name.match(TokenList.componentNameMatch);
				if (!matches) return;
				const expectedType = matches[2];
			});
	}
};
