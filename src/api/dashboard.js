import { apiHost } from './host.js';

export const getAdminDashboard = async (
	adminEmail = '',
	visitorId = '',
	abortCont
) => {
	try {
		if (adminEmail.length === 0 || visitorId.length === 0) {
			return false;
		}

		const res = await fetch(`${apiHost}api/admin/dashboard`, {
			signal: abortCont.signal,
			headers: {
				'Content-Type': 'application/json',
				email: adminEmail,
				visitorid: visitorId,
			},
		});

		if (res.status === 200) {
			const data = await res.json();
			return data;
		}

		return false;
	} catch (error) {
		return false;
	}
};
