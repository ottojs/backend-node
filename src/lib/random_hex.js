function random_hex() {
	const values = '0123456789ABCDEF';
	let hexvalue = '#';
	for (let i = 0; i < 6; i++) {
		hexvalue += values[Math.floor(Math.random() * 16)];
	}
	return hexvalue;
}

export default random_hex;
