const withTimeZone = label => (
	label + ' GMT+' + -(new Date().getTimezoneOffset() / 60)
);

const getLocalDate = date => {
	date = new Date(date);
	if (date == 'Invalid Date') {
		return date;
	}
	return new Date(date - date.getTimezoneOffset() * 60000).toJSON().slice(0, 19).replace('T', ' ');
};

export { withTimeZone, getLocalDate };
