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
