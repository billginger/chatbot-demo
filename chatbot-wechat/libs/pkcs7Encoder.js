// PKCS#7 Encoder
module.exports = {
	encode: text => {
		const blockSize = 32;
		const amountToPad = blockSize - (text.length % blockSize);
		const result = Buffer.alloc(amountToPad, amountToPad);
		return Buffer.concat([text, result]);
	},
	decode: text => {
		let pad = text[text.length - 1];
		if (pad < 1 || pad > 32) {
			pad = 0;
		}
		return text.slice(0, text.length - pad);
	}
};
