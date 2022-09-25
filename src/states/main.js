import { atom, selector } from 'recoil';

export const apiHostState = atom({
	key: 'apiHost',
	default: '',
});

export const isAdminState = atom({
	key: 'isAdmin',
	default: false,
});

export const pendingRequestsState = atom({
	key: 'pendingRequests',
	default: [],
});

export const usersListState = atom({
	key: 'usersList',
	default: [],
});

export const usersListSortedState = selector({
	key: 'usersListSorted',
	get: ({ get }) => {
		const tempList = get(usersListState);

		let usersList = tempList.map((x) => x);
		usersList.sort((a, b) => {
			return a.username > b.username ? 1 : -1;
		});

		return usersList;
	},
});

export const adminEmailState = atom({
	key: 'adminEmail',
	default: '',
});

export const adminPwdState = atom({
	key: 'adminPwd',
	default: '',
});

export const adminTmpEmailState = atom({
	key: 'adminTmpEmail',
	default: '',
});

export const adminTmpPwdState = atom({
	key: 'adminTmpPwd',
	default: '',
});

export const countPendingRequestsState = selector({
	key: 'countPendingRequests',
	get: ({ get }) => {
		const pendingReq = get(pendingRequestsState);
		return pendingReq.length;
	},
});

export const congsListState = atom({
	key: 'congsList',
	default: [],
});

export const congsListSortedState = selector({
	key: 'congsListSorted',
	get: ({ get }) => {
		const tempList = get(congsListState);

		let congsList = tempList.map((x) => x);
		congsList.sort((a, b) => {
			return a.cong_name > b.cong_name ? 1 : -1;
		});

		return congsList;
	},
});

export const isMfaVerifiedState = atom({
	key: 'isMfaVerified',
	default: false,
});

export const hasErrorEmailState = atom({
	key: 'hasErrorEmail',
	default: false,
});

export const hasErrorPwdState = atom({
	key: 'hasErrorPwd',
	default: false,
});

export const adminTokenState = atom({
	key: 'adminToken',
	default: '',
});

export const hasErrorTokenState = atom({
	key: 'hasErrorToken',
	default: false,
});

export const isAdminLoggedState = atom({
	key: 'isAdminLogged',
	default: true,
});

export const isLogoutState = atom({
	key: 'isLogout',
	default: false,
});

export const isMfaEnabledState = atom({
	key: 'isMfaEnabled',
	default: false,
});

export const qrCodePathState = atom({
	key: 'qrCodePath',
	default: '',
});

export const secretTokenPathState = atom({
	key: 'secretTokenPath',
	default: '',
});

export const blockedRequestsState = atom({
	key: 'blockedRequests',
	default: [],
});

export const visitorIDState = atom({
	key: 'visitorID',
	default: '',
});

export const isLoginAttemptState = atom({
	key: 'isLoginAttempt',
	default: false,
});

export const lockRoleState = atom({
	key: 'lockRole',
	default: false,
});

export const dbAnnouncementsState = atom({
	key: 'dbAnnouncements',
	default: [],
});
