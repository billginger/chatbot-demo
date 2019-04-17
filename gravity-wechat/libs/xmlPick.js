module.exports = (xml, key) => {
	const regexp = new RegExp(`<${key}><!\\[CDATA\\[(.+)]]></${key}>`);
	let value = xml.match(regexp);
	value = value && value[1];
	return value;
};
