import * as fs from "node:fs";
import ASParser from "./actionscript/parser.js";

export default class ReMXML {
	#inputAS = null;
	#generated = null;

	loadInput(path) {
		if (!fs.existsSync(path)) {
			throw new Error("Input path does not exist. Path:", path);
		}
		this.#inputAS = fs.readFileSync(path);
	}

	beginConversion() {
		const parser = new ASParser(this.#inputAS.toString());
		/*const xw = new XMLWriter();
		xw.startDocument();
		xw.startElement(parser.extends);
		xw.writeAttribute('foo', 'value');
		xw.text('Some content');
		xw.endDocument();*/
		//this.#generated = new XML(parser.extends);
		//console.log(parser);
	}
};
