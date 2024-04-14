export default class XMLNode {
	#attributes = []
	#name = "";

	constructor(name) {
		this.#name = name;
	}

	/**
	 * @param {string} name
	 */
	set name(name) {
		if (typeof name !== "string") {
			throw new TypeError("Expected name to be of type string.");
		} else if (name.length <= 0) {
			throw new Error("Expected name to be over one character.");
		}
		this.#name = name;
	}

	/**
	 * @returns {string | void}
	 */
	get name() {
		if (typeof this.#name == "undefined") {
			return null;
		}
		return this.#name;
	}

	get attributes() {
		return this.#attributes;
	}

	constructNodeString() {
		
	}
};
