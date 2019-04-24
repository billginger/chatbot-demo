const getCookie = key => {
	const cookieStr = document.cookie;
	const cookieArr = cookieStr.split('; ');
	for (let i = 0; i < cookieArr.length; i++) {
		const arr = cookieArr[i].split('=');
		if (key == arr[0]) {
			return arr[1];
		}
	}
};

const setCookie = (key, value) => {
	let date = new Date();
	date.setFullYear(date.getFullYear() + 3);
	const expires = date.toUTCString();
	document.cookie = `${key}=${value}; expires=${expires}`;
};

const getStorage = key => (
	window.localStorage ? localStorage.getItem(key) : getCookie(key)
);

const setStorage = (key, value) => (
	window.localStorage ? localStorage.setItem(key, value) : setCookie(key, value)
);

export { getStorage, setStorage };
