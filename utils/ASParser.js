export default class ASParser {
	className = null;
	extends = null;
	namespaces = {
		// use the default flex namespaces
		fx: "http://ns.adobe.com/mxml/2009",
		s: "library://ns.adobe.com/flex/spark",
		mx: "library://ns.adobe.com/flex/mx"
	};
	/** @type {string[]} */
	imported = [];
	vars = [];
	functions = [];
	components = {};

	/**
	 * @param {string} input 
	 */
	constructor(input) {
		const lines = input.split("\n");
		lineLoop: for (let line of lines) {
			line = line.trim();
			const keywords = line.split(" ");
			let access, isInComplex = false;
			keywordLoop: for (let i = 0; i < keywords.length; i++) {
				const keyword = this.#keywordMapping(keywords[i]);
				if (!keyword) {
					continue;
				}

				let arg;
				if (keyword.hasArg) {
					arg = keywords[i + 1];
				}
				switch (keyword.does) {
					case "import": {
						this.imported.push(arg.slice(0, -1));
						break keywordLoop;
					}
					case "changeAccess": {
						access = keywords[i];
						continue;
					}
					case "class": {
						this.className = arg;
						continue;
					}
					case "classExtends": {
						let namespace = this.imported.find((v) => v.endsWith(arg));
						if (namespace.startsWith("spark")) {
							namespace = this.namespaces.s;
						}
						const component = {
							name: arg,
							from: namespace,
						};
						this.components.root = component;
						break keywordLoop;
					}
					case "beginFuncDefinition": {
						let namespace = this.imported.find((v) => v.endsWith(arg));
						if (namespace.startsWith("spark")) {
							namespace = this.namespaces.s;
						}
						const component = {
							name: arg,
							from: namespace,
						};
						this.components.root = component;
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
