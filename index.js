/*
reMXML
Written by octanuary
*/
import * as fs from "node:fs";
import ReMXML from "./ReMXML.js";

const inputFiles = fs.readdirSync("./inputs");
for (const path of inputFiles) {
	if (path.slice(-3) !== ".as") {
		// i'm a creeeeep
		// i'm a weirdo
		// what the hell am i doing heeeere
		// i don't belong here
		continue;
	}
	const reMXML = new ReMXML();
	reMXML.loadInput("./inputs/" + path);
	reMXML.beginConversion();
}
