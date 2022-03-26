import { promiseSetRecoil } from 'recoil-outside';
import {
	adminEmailState,
	adminPwdState,
	adminTmpEmailState,
	adminTmpPwdState,
	adminTokenState,
	visitorIDState,
	isAdminState,
	isMfaEnabledState,
	isMfaVerifiedState,
	pendingRequestsState,
	usersListState,
} from '../states/main';

export const handleAdminLogout = async () => {
	await promiseSetRecoil(pendingRequestsState, []);
	await promiseSetRecoil(usersListState, []);
	await promiseSetRecoil(adminEmailState, '');
	await promiseSetRecoil(adminPwdState, '');
	await promiseSetRecoil(adminTmpEmailState, '');
	await promiseSetRecoil(adminTmpPwdState, '');
	await promiseSetRecoil(adminTokenState, '');
	await promiseSetRecoil(visitorIDState, '');
	await promiseSetRecoil(isAdminState, false);
	await promiseSetRecoil(isMfaEnabledState, false);
	await promiseSetRecoil(isMfaVerifiedState, false);
};
