import { atom } from 'recoil';

export const isAdminState = atom({
	key: 'isAdmin',
	default: true,
});
