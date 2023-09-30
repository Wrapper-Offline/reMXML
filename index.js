import * as fs from "node:fs";
import ReMXML from "./ReMXML.js";

const inputFiles = fs.readdirSync("./inputs");
for (const path of inputFiles) {
	const reMXML = new ReMXML();
	reMXML.loadInput("./inputs/" + path);
	reMXML.beginConversion();
}
