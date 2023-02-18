import { promiseSetRecoil } from 'recoil-outside';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

export const displayMultiProviderAuthError = async () => {
  await promiseSetRecoil(appMessageState, 'Your account is already linked to another credential');
  await promiseSetRecoil(appSeverityState, 'warning');
  await promiseSetRecoil(appSnackOpenState, true);
};
