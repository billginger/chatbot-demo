const getLocalDate = date => {
	date = new Date(date);
	if (date == 'Invalid Date') {
		return date;
	}
	date = new Date(date - date.getTimezoneOffset() * 60000).toJSON().slice(0, 19).replace('T', ' ');
	return date + ' GMT+' + -(new Date().getTimezoneOffset() / 60);
};

export { getLocalDate };
