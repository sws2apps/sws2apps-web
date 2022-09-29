import { getApiHost } from './host.js';

const apiHost = getApiHost();

export const validateMe = async (
	adminEmail = '',
	visitorId = '',
	abortCont
) => {
	try {
		if (adminEmail.length === 0 || visitorId.length === 0) {
			return false;
		}

		const res = await fetch(`${apiHost}api/admin/`, {
			signal: abortCont.signal,
			headers: {
				'Content-Type': 'application/json',
				email: adminEmail,
				visitor_id: visitorId,
			},
		});

		if (res.status === 200) {
			return true;
		}

		return false;
	} catch (error) {
		return false;
	}
};

export const loginAdmin = async (
	adminEmail = '',
	adminPassword = '',
	visitorId = '',
	abortCont
) => {
	try {
		if (
			adminEmail.length === 0 ||
			adminPassword.length === 0 ||
			visitorId.length === 0
		) {
			return 'Email and password are required before accesssing the Admin Panel';
		}

		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			visitor_id: visitorId,
		};

		const res = await fetch(`${apiHost}user-login`, {
			signal: abortCont.signal,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(reqPayload),
		});

		if (res.status === 200) {
			return true;
		}

		const data = await res.json();
		return data.message;
	} catch (error) {
		return error.message;
	}
};

export const verifyToken = async (
	adminEmail = '',
	adminToken = '',
	visitorId = '',
	abortCont
) => {
	try {
		if (
			adminEmail.length === 0 ||
			adminToken.length === 0 ||
			visitorId.length === 0
		) {
			return 'Verified token is required before accesssing the Admin Panel';
		}

		if (adminToken.length !== 6) {
			return 'OTP code should always be 6 numbers';
		}

		const res = await fetch(`${apiHost}api/mfa/verify-token`, {
			signal: abortCont.signal,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				email: adminEmail,
				visitor_id: visitorId,
			},
			body: JSON.stringify({ token: adminToken }),
		});

		if (res.status === 200) {
			return true;
		}

		const data = await res.json();
		return data.message;
	} catch (error) {
		return error.message;
	}
};
