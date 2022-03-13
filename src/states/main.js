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

export const adminEmailState = atom({
	key: 'adminEmail',
	default: '',
});

export const adminPasswordState = atom({
	key: 'adminPassword',
	default: '',
});

export const countPendingRequestsState = selector({
	key: 'countPendingRequests',
	get: ({ get }) => {
		const pendingReq = get(pendingRequestsState);
		return pendingReq.length;
	},
});
