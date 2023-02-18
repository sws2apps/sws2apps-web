import { promiseGetRecoil } from 'recoil-outside';
import { apiHostState, isOnlineState, visitorIDState } from '../states/main';

export const getProfile = async () => {
  const apiHost = await promiseGetRecoil(apiHostState);
  const visitorID = await promiseGetRecoil(visitorIDState);
  const isOnline = await promiseGetRecoil(isOnlineState);

  return { apiHost, visitorID, isOnline };
};
