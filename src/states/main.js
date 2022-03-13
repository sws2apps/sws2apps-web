import { atom, selector } from 'recoil';

export const apiHostState = atom({
	key: 'apiHost',
	default: '',
});

export const isAdminState = atom({
	key: 'isAdmin',
	default: true,
});

export const pendingRequestsState = atom({
	key: 'pendingRequests',
	default: [],
});

export const adminEmailState = atom({
	key: 'adminEmail',
	default: 'sws2apps@gmail.com',
});

export const adminPasswordState = atom({
	key: 'adminPassword',
	default: 'swsDev2022BaseFire!HARI',
});

export const countPendingRequestsState = selector({
	key: 'countPendingRequests',
	get: ({ get }) => {
		const pendingReq = get(pendingRequestsState);
		return pendingReq.length;
	},
});
