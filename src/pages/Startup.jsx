import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import Box from '@mui/material/Box';
import { SetupMFA, SignIn, UnauthorizedRole, VerifyMFA } from '../features/startup';
import WaitingPage from '../components/WaitingPage';
import {
  apiHostState,
  isAdminState,
  isAppClosingState,
  isOnlineState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  qrCodePathState,
  secretTokenPathState,
  visitorIDState,
} from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

const Startup = () => {
  const navigate = useNavigate();

  let abortCont = useMemo(() => new AbortController(), []);

  const { isAuthenticated, user } = useFirebaseAuth();

  const [isUserMfaVerify, setIsUserMfaVerify] = useRecoilState(isUserMfaVerifyState);
  const [isUserSignIn, setIsUserSignIn] = useRecoilState(isUserSignInState);

  const setIsAdmin = useSetRecoilState(isAdminState);
  const setQrCodePath = useSetRecoilState(qrCodePathState);
  const setSecretToken = useSetRecoilState(secretTokenPathState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsAppClosing = useSetRecoilState(isAppClosingState);

  const isUserMfaSetup = useRecoilValue(isUserMfaSetupState);
  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);

  const [isAuth, setIsAuth] = useState(true);

  const checkLogin = useCallback(async () => {
    try {
      if (isOnline && apiHost !== '' && visitorID !== '') {
        const res = await fetch(`${apiHost}api/admin/`, {
          signal: abortCont.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'admin',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        if (res.status === 200) {
          setIsAdmin(true);
          navigate('/');
        }

        if (res.status === 404) {
          setIsAppClosing(true);
        }

        if (res.status === 403) {
          const res = await fetch(`${apiHost}user-login`, {
            signal: abortCont.signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              appclient: 'admin',
              appversion: import.meta.env.PACKAGE_VERSION,
              uid: user.uid,
            },
            body: JSON.stringify({ visitorid: visitorID }),
          });

          const data = await res.json();

          if (res.status === 200) {
            setIsUserSignIn(false);
            setIsUserMfaVerify(true);
          } else {
            if (data.secret && data.qrCode) {
              setQrCodePath(data.qrCode);
              setSecretToken(data.secret);
            }
            if (data.message) {
              setAppMessage(data.message);
              setAppSeverity('warning');
              setAppSnackOpen(true);
            }
          }
        }

        setIsAuth(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    apiHost,
    abortCont,
    isOnline,
    navigate,
    visitorID,
    user,
    setIsAdmin,
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setQrCodePath,
    setSecretToken,
    setIsUserMfaVerify,
    setIsUserSignIn,
    setIsAppClosing,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuth(false);
    }

    if (isAuthenticated) {
      setIsAuth(true);
      checkLogin();
    }
  }, [checkLogin, isAuthenticated]);

  return (
    <Box>
      {isAuth && <WaitingPage />}
      {!isAuth && (
        <>
          {isUserSignIn && <SignIn />}
          {isUserMfaSetup && <SetupMFA />}
          {isUnauthorizedRole && <UnauthorizedRole />}
          {isUserMfaVerify && <VerifyMFA />}
        </>
      )}
    </Box>
  );
};

export default Startup;
