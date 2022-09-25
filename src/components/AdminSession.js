import { useCallback, useMemo, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	apiHostState,
	isAdminState,
	isLoginAttemptState,
	isMfaEnabledState,
	isMfaVerifiedState,
	visitorIDState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const AdminSession = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setVisitorID = useSetRecoilState(visitorIDState);
	const setIsAdmin = useSetRecoilState(isAdminState);
	const setIsMfaEnabled = useSetRecoilState(isMfaEnabledState);
	const setIsMfaVerified = useSetRecoilState(isMfaVerifiedState);
	const setIsLoginAttempt = useSetRecoilState(isLoginAttemptState);
	const setAdminEmail = useSetRecoilState(adminEmailState);

	const apiHost = useRecoilValue(apiHostState);

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleValidateSession = useCallback(
		async (visitorID, email) => {
			try {
				const adminRes = await fetch(`${apiHost}api/admin/`, {
					signal: abortCont.signal,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						email: email,
						visitor_id: visitorID,
					},
				});

				const isValid =
					adminRes.headers.get('content-type') ===
					'application/json; charset=utf-8'
						? true
						: false;

				if (isValid) {
					if (adminRes.status === 200) {
						setAdminEmail(email);
						setIsMfaVerified(true);
						setIsMfaEnabled(true);
						setIsAdmin(true);
						setAppMessage('You are connected as administrator');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else if (adminRes.status === 403) {
						await handleClearAdmin();
					}
				}
				setIsLoginAttempt(false);
			} catch (err) {
				setAppMessage(err);
				setAppSeverity('error');
				setAppSnackOpen(true);
			}
		},
		[
			abortCont,
			apiHost,
			handleClearAdmin,
			setAdminEmail,
			setAppMessage,
			setAppSeverity,
			setAppSnackOpen,
			setIsAdmin,
			setIsLoginAttempt,
			setIsMfaEnabled,
			setIsMfaVerified,
		]
	);

	useEffect(() => {
		// get visitor ID and check if there is an active connection
		const getUserID = async () => {
			const fpPromise = FingerprintJS.load({
				apiKey: 'XwmESck7zm6PZAfspXbs',
			});

			let visitorId = '';

			do {
				const fp = await fpPromise;
				const result = await fp.get();
				visitorId = result.visitorId;
			} while (visitorId.length === 0);

			setVisitorID(visitorId);

			setTimeout(() => {
				const email = localStorage.getItem('email');
				handleValidateSession(visitorId, email);
			}, 3000);
		};

		setIsLoginAttempt(true);
		getUserID();
	}, [handleValidateSession, setIsLoginAttempt, setVisitorID]);

	return <></>;
};

export default AdminSession;
