import * as XMLNode from "./XMLNode.js";

export default class XML {
	#root;

	constructor(tagName) {
		this.#root = new XMLNode(tagName);
		this.#root.name;
	}
};
