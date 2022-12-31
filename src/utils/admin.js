import { promiseSetRecoil } from 'recoil-outside';
import { isAdminState, qrCodePathState, secretTokenPathState, userEmailState, userPasswordState } from '../states/main';

export const handleAdminLogout = async () => {
  localStorage.removeItem('email');
  await promiseSetRecoil(userPasswordState, '');
  await promiseSetRecoil(userEmailState, '');
  await promiseSetRecoil(qrCodePathState, '');
  await promiseSetRecoil(secretTokenPathState, '');
  await promiseSetRecoil(isAdminState, false);
};
