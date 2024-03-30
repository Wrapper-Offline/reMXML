export default function paramAttributes(name, tokens) {
	let building = "", params = {};
	for (const tokenIn in tokens) {
		const token = tokens[tokenIn];
		switch (tokenIn % 4) {
			case 0: {
				building = token;
				break;
			}
			case 2: {
				params[building] = token;
				building = "";
			}
		}
	}
	return {
		name: name,
		params: params
	};
};
