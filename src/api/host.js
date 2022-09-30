const getApiHost = () => {
	if (import.meta.env.DEV) {
		return 'http://localhost:8000/';
	} else {
		return 'https://sws2apps-api.onrender.com/';
	}
};

export const apiHost = await getApiHost();
