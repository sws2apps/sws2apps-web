import { getAuth, signOut } from 'firebase/auth';
import { promiseSetRecoil } from 'recoil-outside';
import { isAdminState, qrCodePathState, secretTokenPathState } from '../states/main';

export const handleAdminLogout = async () => {
  const auth = await getAuth();
  if (auth) await signOut(auth);
  await promiseSetRecoil(qrCodePathState, '');
  await promiseSetRecoil(secretTokenPathState, '');
  await promiseSetRecoil(isAdminState, false);
};
