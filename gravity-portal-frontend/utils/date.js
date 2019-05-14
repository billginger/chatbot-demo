const withTimeZone = label => {
	const timezone = -(new Date().getTimezoneOffset() / 60);
	const plus = timezone >= 0 && '+';
	return `${label} GMT${plus}${timezone}`;
};

const getLocalDate = date => {
	date = new Date(date);
	if (date == 'Invalid Date') {
		return 'Invalid Date';
	}
	return new Date(date - date.getTimezoneOffset() * 60000).toJSON().slice(0, 19).replace('T', ' ');
};

export { withTimeZone, getLocalDate };
