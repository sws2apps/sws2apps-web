import { useCallback, useMemo, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { handleAdminLogout } from '../utils/admin';
import {
	apiHostState,
	isAdminState,
	isMfaEnabledState,
	isMfaVerifiedState,
	sessionIDState,
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
	const setSessionID = useSetRecoilState(sessionIDState);
	const setIsAdmin = useSetRecoilState(isAdminState);
	const setIsMfaEnabled = useSetRecoilState(isMfaEnabledState);
	const setIsMfaVerified = useSetRecoilState(isMfaVerifiedState);

	const apiHost = useRecoilValue(apiHostState);

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleValidateSession = useCallback(
		async (tempID) => {
			try {
				const adminRes = await fetch(`${apiHost}api/admin/`, {
					signal: abortCont.signal,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						session_id: tempID,
					},
				});

				const isValid = adminRes.headers.get('content-length') ? true : false;

				if (isValid) {
					if (adminRes.status === 200) {
						setSessionID(tempID);
						setIsMfaVerified(true);
						setIsMfaEnabled(true);
						setIsAdmin(true);
						setAppMessage('You are connected as administrator');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else {
						await handleClearAdmin();
						setAppMessage(
							'You have been disconnected from the administration session'
						);
						setAppSeverity('info');
						setAppSnackOpen(true);
					}
				}
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
			setIsMfaEnabled,
			setIsMfaVerified,
			setSessionID,
		]
	);

	useEffect(() => {
		// attemp to access admin
		const tempID = localStorage.getItem('session_id');
		if (tempID?.length > 0) {
			setTimeout(() => {
				handleValidateSession(tempID);
			}, 5000);
		}
	}, [handleValidateSession]);

	return <></>;
};

export default AdminSession;
