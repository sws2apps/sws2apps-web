import { useCallback, useMemo, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { handleAdminLogout } from '../utils/admin';
import {
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

	const apiHost = useRecoilValue(apiHostState);

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleValidateSession = useCallback(
		async (visitorID) => {
			try {
				const adminRes = await fetch(`${apiHost}api/admin/`, {
					signal: abortCont.signal,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						visitor_id: visitorID,
					},
				});

				const isValid = adminRes.headers.get('content-length') ? true : false;

				if (isValid) {
					if (adminRes.status === 200) {
						setIsMfaVerified(true);
						setIsMfaEnabled(true);
						setIsAdmin(true);
						setAppMessage('You are connected as administrator');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else {
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
			const fp = await fpPromise;
			const result = await fp.get();
			const visitorId = result.visitorId;

			setVisitorID(visitorId);

			setTimeout(() => {
				handleValidateSession(visitorId);
			}, 3000);
		};

		setIsLoginAttempt(true);
		getUserID();
	}, [handleValidateSession, setIsLoginAttempt, setVisitorID]);

	return <></>;
};

export default AdminSession;
